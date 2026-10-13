/**
 * Phase-1 Hub Net transport policy (Google build).
 *
 * Mirrors the emitter's enforcement authority: an i2i (individual↔individual)
 * request to a target that is not provably inside the LAN is refused *before*
 * any manifest is pushed. Set `DGUI_HUBNET_I2I_LAN_ONLY=0` (or
 * `DGUI_HUBNET_I2I_ALLOW_REMOTE=1`) to allow the cloud/websocket relay.
 */

export type TransportMode = 'lan' | 'cloud' | 'websocket';
export type TransportScope = 'loopback' | 'lan' | 'public' | 'unset' | 'unparsable';
export type HubNetLinkKind = 'i2i' | 'i2e' | 'e2e';

export interface TransportClassification {
  target: string;
  host: string;
  port?: number;
  scope: TransportScope;
  isLan: boolean;
  allowedTransports: TransportMode[];
  reason: string;
}

export interface TransportPolicy {
  phase: number;
  i2i: TransportMode[];
  i2e: TransportMode[];
  e2e: TransportMode[];
  allowRemoteI2I: boolean;
  note: string;
}

const LAN_SUFFIXES = ['.local', '.lan', '.home', '.internal', '.home.arpa', '.intranet'];

export function transportsForLink(link: HubNetLinkKind, allowRemoteI2I: boolean): TransportMode[] {
  switch (link) {
    case 'i2i':
      return allowRemoteI2I ? ['lan', 'cloud', 'websocket'] : ['lan'];
    case 'i2e':
    case 'e2e':
      return ['lan', 'cloud', 'websocket'];
  }
}

export function hubTransportPolicy(): TransportPolicy {
  const forcedLanOnly =
    process.env.DGUI_HUBNET_I2I_LAN_ONLY === '1' || process.env.DGUI_HUBNET_I2I_ALLOW_REMOTE === '0';
  const allowRemoteI2I = !forcedLanOnly;
  return {
    phase: 1,
    i2i: transportsForLink('i2i', allowRemoteI2I),
    i2e: transportsForLink('i2e', allowRemoteI2I),
    e2e: transportsForLink('e2e', allowRemoteI2I),
    allowRemoteI2I,
    note: allowRemoteI2I
      ? 'i2i is allowed over LAN, cloud relay, or websocket.'
      : 'i2i is forced LAN-only (DGUI_HUBNET_I2I_LAN_ONLY=1) — off-network individual↔individual is refused.',
  };
}

function isIpv4Private(host: string): boolean {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if ([a, b, Number(m[3]), Number(m[4])].some(n => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  if (a === 127) return true;
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

function isIpv6Private(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, '').toLowerCase();
  if (h === '::1' || h === '0:0:0:0:0:0:0:1') return true;
  if (h.startsWith('fe80')) return true;
  if (/^f[cd]/.test(h)) return true;
  const mapped = /::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(h);
  if (mapped) return isIpv4Private(mapped[1]);
  return false;
}

export function classifyHubTransport(target: string | undefined, link: HubNetLinkKind = 'i2i'): TransportClassification {
  const policy = hubTransportPolicy();
  const allowedTransports = transportsForLink(link, policy.allowRemoteI2I);
  const raw = (target ?? '').trim();

  if (!raw) {
    return { target: raw, host: '', scope: 'unset', isLan: false, allowedTransports, reason: 'No target URL supplied.' };
  }

  let host: string;
  let port: number | undefined;
  try {
    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`;
    const u = new URL(withScheme);
    host = u.hostname;
    port = u.port ? Number(u.port) : undefined;
  } catch {
    return { target: raw, host: '', scope: 'unparsable', isLan: false, allowedTransports, reason: `"${raw}" is not a parsable URL.` };
  }

  const lower = host.toLowerCase();
  let scope: TransportScope;
  let reason: string;

  if (lower === 'localhost' || lower === '::1') {
    scope = 'loopback';
    reason = `${host} is loopback — inside the local network.`;
  } else if (isIpv4Private(lower) || isIpv6Private(lower)) {
    scope = 'lan';
    reason = `${host} is a private/link-local address — inside the local network.`;
  } else if (LAN_SUFFIXES.some(sfx => lower.endsWith(sfx))) {
    scope = 'lan';
    reason = `${host} uses a local-network suffix — LAN name.`;
  } else if (/^\d{1,3}(\.\d{1,3}){3}$/.test(lower)) {
    scope = 'public';
    reason = `${host} is a routable public IP address.`;
  } else if (!lower.includes('.')) {
    scope = 'unparsable';
    reason = `"${host}" is a bare hostname with no TLD — LAN cannot be proven.`;
  } else {
    scope = 'public';
    reason = `${host} is a public hostname (FQDN).`;
  }

  const isLan = scope === 'loopback' || scope === 'lan';
  if (isLan) reason += ' Allowed for ' + link + ' in phase 1.';
  else if (!policy.allowRemoteI2I && link === 'i2i') reason += ' REJECTED: phase-1 i2i is LAN-only.';

  return { target: raw, host, port, scope, isLan, allowedTransports, reason };
}

export interface TransportVerdict {
  ok: boolean;
  classification: TransportClassification;
  policy: TransportPolicy;
  mode: TransportMode;
  error?: string;
}

export function assertHubTransport(link: HubNetLinkKind, target: string | undefined): TransportVerdict {
  const policy = hubTransportPolicy();
  const classification = classifyHubTransport(target, link);
  const allowed = transportsForLink(link, policy.allowRemoteI2I);
  const mode: TransportMode = classification.isLan ? 'lan' : 'cloud';

  const lanOnly = allowed.every(t => t === 'lan');
  if (lanOnly && !classification.isLan) {
    return {
      ok: false,
      classification,
      policy,
      mode,
      error:
        `Phase-1 transport policy: ${link} allows ${allowed.join(' / ')} only, ` +
        `but the dock target "${classification.target}" classifies as ${classification.scope}. ${classification.reason} ` +
        (link === 'i2i'
          ? 'Set the dock URL to a LAN address (e.g. http://192.168.1.42:3198). Remote individual↔individual arrives with the WebSocket/WebRTC adapter patch.'
          : ''),
    };
  }

  return { ok: true, classification, policy, mode };
}
