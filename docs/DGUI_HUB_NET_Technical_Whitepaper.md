# DGUI HUB NET: A Governed Human-to-Enterprise Agentic Workforce Architecture

## DGUI PERSONA, DGUI EMITTER, DGUI DOCKING STATION, DGUI TUFTY DEVICE, GATED INFERENCE ROUTER, and DeckerGUI OS

**Author:** Wan Mohd Azizi Bin Wan Hosen (WMAi)  
**Role:** Founder, Agentic AI Engineer, Researcher and Developments — DeckerGUI Project  
**Date:** 23 September 2026

## Abstract
We present DGUI HUB NET, a proposed networking and deployment architecture within the DeckerGUI Unified Agentic AI Integration Ecosystem for connecting individual digital capabilities to enterprise work. The architecture begins with an Individual represented through DGUI PERSONA, a structured capability layer that combines DGUI DSYNC/DGM, DGUI Emitter, and DGUI DSYNC/KPI Tokenizer functions. The Persona initializes a cooperating DGUI Agent Swarm and exposes eligible individual AI agents to DGUI HUB NET for enterprise assignment or work requests.

DGUI HUB NET provides the coordination layer between individuals and companies. After an assignment is established, DGUI Emitter performs a proposed three-layer validation covering agent structure, governance, and operational/KPI prerequisites before minting a deployable DGUI Docking Agent. Docking Agent implementations may include Claw Agents, Hermes Agents, or customised agents such as LangChain-based runtimes. The resulting deployment instruction package, INSTRUCT.zip, is delivered to a company Docking Station, where the assigned agent is instantiated as a 1:1 operational agent instance.

The architecture further integrates the DeckerGUI Tufty Device and Docking Station as physical interfaces to DeckerGUI OS. Tufty is the **connector that turns on DeckerGUI OS**: boot is gated on the physical Tufty device key (§6.1), so the device is the ignition of the OS rather than merely a credential. The Docking Station supports Work, CICO, and Idle modes in the current Phase 3 design, while the Tufty/Decker device provides local AI computation, enterprise connectivity, encrypted local storage, and docking-based model or session updates. The proposed end-to-end lifecycle records assignment, work sessions, user/company associations, KPI events, and completion state. Following successful work, DGUI Emitter Studio can be used by a company to issue a Reward Key, defined in this architecture as an exclusive AI tooling or computational benefit sponsored by the issuing company.

This whitepaper is an architectural proposal and system specification, not a report of completed experimental validation. Sections marked *(implementation)* document components that are delivered and running in the DeckerGUI ecosystem today — notably the `i2i / i2e / e2e` link topologies of the connection model (§4.4), the client Docking Station bootstrap command `dgui dock` (§6.4), the live deployment telemetry overlay behind the HUB NET MAP (§7.4), the WebAuthn passkey operator authorization gate (§9.2), the Tufty Enter-OS boot gate (§6.1), and the gated inference router with SDK-config routing (§6.5). Quantitative performance, security, interoperability, and economic outcomes remain subjects for implementation and evaluation.

**Keywords:** DGUI HUB NET, DGUI PERSONA, DGUI Emitter, DGUI Docking Agent, DGUI Docking Station, DGUI Tufty, Tufty device key, Enter-OS gate, gated inference router, SDK-config routing, inference sufficiency, DeckerGUI OS, agentic AI, digital workforce, enterprise AI, KPI, agent deployment, link topology, i2i, i2e, e2e, client docking station bootstrap, live deployment telemetry, WebAuthn passkey authorization, HUB NET MAP

## 1. Introduction

### 1.1 Motivation
Current AI systems are commonly organized around models, APIs, applications, or isolated agents. DeckerGUI approaches the problem from a workforce and infrastructure perspective: how can a person's validated capabilities be represented as a governed digital capability, organized into cooperating agents, connected to an enterprise, deployed through controlled infrastructure, and recorded throughout its working lifecycle?

The proposed DGUI HUB NET architecture addresses this gap. It treats the individual, the agentic runtime, the enterprise, the physical device, and the inference provider as distinct but interoperable layers. The central design principle is that the individual is not replaced by an AI clone. Instead, selected and authorized capabilities are structured into DGUI PERSONA and operationalized as an agent swarm.

The source architecture for DeckerGUI already defines Cloud, Local, and Enterprise operating modes, JSON-based configuration, workflow integration, KPI logging, task tracking, token-based access control, encrypted configurations, and SSL/TLS-secured communication. [1] Phase 2 extends this software foundation into a portable hardware device capable of local inference, enterprise connectivity, docking, model refresh, and encrypted local storage. [2] Phase 3 extends the hardware into a multi-purpose Docking Station with Work, CICO, and Idle modes. [3]

### 1.2 Contributions
We propose the following architectural contributions:

1. A DGUI PERSONA abstraction for representing an individual's selected and authorized capabilities.
2. A DGUI Agent Swarm model in which a Persona initializes a predefined set of cooperating AI agents rather than a single undifferentiated assistant.
3. DGUI HUB NET as a two-sided coordination layer for individual-to-company agent assignment and work requests.
4. DGUI Emitter as a proposed validation and minting authority for deployable DGUI Docking Agents.
5. DGUI Docking Agents as enterprise-side deployment/control agents supporting multiple runtime families, including Claw, Hermes, and customised agent implementations.
6. INSTRUCT.zip as a deployment instruction package for reconstructing the assigned agentic workload at the enterprise Docking Station.
7. A lifecycle model linking assignment, deployment, work telemetry, user/company records, completion, and Reward Keys.
8. A physical-software integration model connecting DGUI HUB NET with the DeckerGUI OS, Tufty Device, and Docking Station.
9. A connector-and-inference model in which the DGUI Tufty device key turns on DeckerGUI OS (boot gated on the physical key) and an SDK-configured gated inference router keeps the running OS supplied with sufficient upstream inference for every feature.

## 2. Related Work and Conceptual Positioning

### 2.1 AI Models and Agent Frameworks
Large language models and agent frameworks provide inference and execution capabilities, but they do not by themselves define a complete workforce lifecycle. DeckerGUI's proposed architecture therefore treats model providers and agent runtimes as replaceable implementation components. The governance, identity, assignment, deployment, and audit layers remain external to any single inference provider.

The existing DeckerGUI Agentic Market concept similarly moves from conventional model/application distribution toward certified Digital Jobs implemented as governed Agentic Containers. [4]

### 2.2 Digital Workforce Architecture
The DGUI Market material defines an Agentic Container containing a Primary Agent and appointed specialist agents such as Seed, Compliance, Runtime, Tool, Skill, Security, Audit, and Update agents. Execution is constrained by DGM governance and approved MCPs, tools, and skills. [4]

DGUI HUB NET extends this concept from the container level to the workforce-network level: it provides a path for an individual's agentic capability to be matched to an enterprise requirement, validated, deployed, monitored, and eventually rewarded.

### 2.3 Hardware-Software Integration
Phase 2 describes the Decker device as a portable personal AI interface supporting local inference, enterprise connectivity, encrypted storage, docking, and synchronization. [2] Phase 3 defines the Docking Station as a multi-purpose hub for enterprise and individual devices and specifies Work, CICO, and Idle operating modes. [3]

These capabilities provide the physical control plane for the proposed DGUI HUB NET deployment lifecycle.

## 3. Background and System Model

### 3.1 DeckerGUI OS
DeckerGUI OS is treated in this whitepaper as the software foundation through which Cloud, Local, and Enterprise inference environments can be routed. The Phase 1 design specifies a Mode Router for Cloud ↔ Local ↔ Enterprise routing, a DeckerConfig.json configuration mechanism, CLI and GUI interfaces, workflow-tool integration, KPI logging, task tracking, and token-based enterprise access. [1]

Boot of DeckerGUI OS is gated on the physical DGUI Tufty device key (§6.1), and the running OS is kept supplied with inference by the gated inference router configured through `DeckerConfig.json` (§6.5). The proposed HUB NET architecture does not replace these mechanisms. It adds a workforce-network layer above them.

### 3.2 DGUI PERSONA
DGUI PERSONA is the proposed digital capability representation of an individual. It should contain only information that is authorized for digital representation and deployment. A Persona can include validated skills, experience-derived knowledge structures, workflow preferences, permissions, approved tools, KPI definitions, and an agent blueprint.

The distinction is fundamental:

Individual ≠ Persona ≠ Agent Swarm ≠ Docking Agent.

The Individual remains the human owner/participant. The Persona is a structured capability representation. The Swarm is the cooperating set of AI agents instantiated from that representation. The Docking Agent is the enterprise-side deployment and control component.

### 3.3 DGUI Agent Swarm
The DGUI Agent Swarm is a predefined multi-agent topology derived from the Persona. A typical structure can include a Primary Agent and appointed Knowledge, Skill, Workflow, Tool, Runtime, Compliance, Security, and Audit agents. The exact set is capability-dependent.

The swarm is structurally defined before enterprise deployment. This allows the system to validate the existence of required components and dependencies instead of relying on unrestricted runtime agent generation.

### 3.4 Inference Providers
Inference Model A and Inference Model B are treated as interchangeable inference providers in this architecture. The Persona and governance layers should remain logically independent of the selected model provider. A provider may execute inference locally, through an enterprise GPU server, or through an approved cloud service, subject to the configured operating mode and policy. The gated inference router and SDK-config routing that realize this interchangeability in the delivered stack — and guarantee sufficient upstream inference for the running OS — are specified in §6.5.

## 4. Proposed DGUI HUB NET Architecture

### 4.1 End-to-End Architecture
The proposed lifecycle is:

Individual → DGUI PERSONA → DGUI Agent Swarm → DGUI HUB NET → Enterprise Assignment → DGUI Emitter → Three-Layer Validation → Mint → DGUI Docking Agent → INSTRUCT.zip → Company Docking Station → 1:1 Agentic Deployment → Work → KPI/Audit → Reward Key.

DGUI HUB NET is therefore not the inference engine and not the enterprise runtime. It is the coordination and networking layer that connects individual digital workforce representations with enterprise work opportunities and deployment infrastructure.

### 4.2 HUB NET Core Functions
DGUI HUB NET is proposed to maintain or coordinate:

• Individual Persona availability and capability metadata.
• Enterprise work requests.
• Agent-to-company matching or assignment.
• Assignment identifiers and lifecycle state.
• Deployment notifications.
• User/company association records.
• Runtime status and completion events.
• Connectivity coordination.
• References required for gRPC and WebRTC-compatible communication.
• Centralized operational records required for audit and transparency.

The exact database schema, retention policy, transport security, and failure-handling behavior require implementation specification and testing.

### 4.3 Request and Assignment Model
The architecture supports two directions.

Individual-initiated request:
Individual → Persona → Swarm → HUB NET → suitable company/work opportunity.

Company-initiated request:
Company → HUB NET → capability requirement → matching → Individual Persona/Swarm → assignment.

The assignment should produce a stable Assignment ID that links the user, company, Persona, agent instance, work period, and deployment lifecycle.

### 4.4 Link Topologies: i2i, i2e, e2e *(implementation)*
The two request directions above describe **who demands work**; a separate, orthogonal property of each established connection describes **who the two peers are**. Every HUB NET connection carries a *link kind* drawn from three topologies:

- **i2i — individual to individual.** Two individuals peer directly (requester and provider are both persons/Personas). Useful for peer-to-peer assistance, review, and collaboration between two DeckerGUI users without an enterprise in the path.
- **i2e — individual to enterprise.** The default topology: an individual's agent swarm is offered to, or requested by, a company. This is the shape of the standard workforce deployment (§8.2).
- **e2e — enterprise to enterprise.** Two companies peer directly through HUB NET (both requester and provider are enterprise entities), e.g. inter-company work hand-offs where HUB NET governs the connection rather than the workforce lifecycle.

**Data model.** Each `HubConnection` record carries `link` (one of `i2i | i2e | e2e`), `requester` and `provider` peer descriptors (`{kind: 'individual' | 'enterprise', id, name, dockUrl?}`). The kind is *derivable* from the peers by `deriveLinkKind(requesterKind, providerKind)`: individual↔individual → `i2i`, individual↔enterprise → `i2e` (symmetric — an enterprise-initiated individual assignment is still `i2e`), enterprise↔enterprise → `e2e`.

**Creation contract.** `POST /api/emitter/hubnet/connections` accepts an explicit `link` plus `requesterKind`/`providerKind`, validates the enums, and rejects any combination where the declared `link` disagrees with the declared peers (HTTP 400, e.g. `link i2e is inconsistent with the peers — requester individual → provider enterprise expects i2e…`). Requester defaults to `individual` and provider defaults to `enterprise`, so existing callers that omit the new fields keep the previous `i2e` behavior.

**CLI.** `dgui hubnet connect --afm <afmId> --company <providerId> --link i2i|i2e|e2e` selects the topology explicitly (default `i2e`). The flag also auto-derives the peer kinds the route requires: `--link i2i` sets `providerKind=individual`; `--link e2e` sets both sides to `enterprise`. `dgui hubnet list` renders a *DGUI HUB NET CONNECTIONS* section showing each connection's id, link, state, `requester → provider`, and dock URL.

**Migration.** Connections created before the link field existed are normalized on load: `_normalize` derives the missing `link` from the peers (backfilled as `i2e` for the legacy individual↔company records), so no ledger migration step is required.

Link topology is deliberately **not** part of the assignment state machine (§8.1): a connection's topology never influences assignment transitions or telemetry, it only records what kind of peers the connection joins.

## 5. DGUI Emitter and Agent Minting

### 5.1 Emitter Role
DGUI Emitter is proposed as the validation, packaging, and minting authority. Its purpose is to convert an eligible agentic workload into a recognized DGUI-deployable object while preserving the governance and operational metadata required by the receiving enterprise.

The Emitter should not be interpreted as minting the human or copying a person's identity. It mints a deployable AI-agent object derived from an authorized Persona and assignment.

### 5.2 Three-Layer Validation
The proposed validation pipeline contains three gates:

Layer 1 — Structural Validation:
Checks the Primary Agent, required sub-agents, dependencies, manifests, runtime requirements, tools, and skills.

Layer 2 — Governance and Security Validation:
Checks DGM policy, permissions, approved tools, approved MCPs, security restrictions, and execution boundaries.

Layer 3 — DSYNC/KPI Operational Validation:
Checks user association, company association, Assignment ID, session identity, KPI schema, telemetry requirements, and audit requirements.

Only a package that passes all required gates proceeds to minting.

### 5.3 DGUI Docking Agent Types
A minted DGUI Docking Agent is an enterprise-side deployment/control agent. Its implementation type may vary:

• Claw Agent.
• Hermes Agent.
• Customised Agent.
• LangChain-based customised implementation, where appropriate.

The runtime framework is therefore an implementation choice; the DGUI contract defines the surrounding identity, validation, assignment, governance, telemetry, and deployment requirements.

### 5.4 INSTRUCT.zip
INSTRUCT.zip is proposed as the deployment instruction package generated after validation and minting. It may contain a Persona reference, Agent Manifest, agent configuration, runtime requirements, policy references, tool/skill references, KPI configuration, assignment metadata, and integrity information.

INSTRUCT.zip should be treated as a deployment package rather than as a copy of a human or a generic model archive.

## 6. DGUI Docking Station and DGUI Tufty Device

### 6.1 Tufty Device
The Phase 2 Decker hardware is described as a mini portable device that provides local AI computation, automated synchronization, a personal workspace, enterprise Work Mode, docking support, hybrid local/enterprise/cloud AI functionality, encrypted storage, token-based authentication, audit logs, and KPI tracking. [2]

Within the proposed HUB NET architecture, the Tufty/Decker device acts as a personal endpoint for the individual's DeckerGUI environment and can provide the local execution or control surface for a Persona and its associated agents.

**Tufty as the OS connector *(implementation)*.** Beyond the hardware roadmap, Tufty is the connector that turns on DeckerGUI OS. Boot is gated on a physical USB device key: a volume carrying a signed manifest (`.dgui-tufty/DGUI_TUFTY/{volume.json, token.pub}`). The Enter-OS gate (`components/TuftyGate.tsx`) detects the volume, verifies the Ed25519 identity against the SPKI public key, syncs gate and model configuration, and only then hands off to the OS intro. Registration upserts the device into `~/.deckergui/tufty/registry.json` (schema `dgui.registry/v1`), and the device identity travels with the connection record (`tufty` in `dgui-emitter/engine/hubnet/devices.ts`), so HUB NET views trust one attested connector. Tufty is therefore both the boot identity and the ignition of the OS: the OS does not come online for an anonymous client, and the same connector anchors its subsequent HUB NET work.

### 6.2 Docking Station
The Phase 3 Docking Station is defined as a multi-purpose hub with single, double, or triple docking slots. It supports three modes:

Work Mode: connects to the enterprise LLM server and requires staff authentication; removal of the device terminates the work connection.

CICO Mode: records work hours and updates enterprise KPI and timesheet systems.

Idle Mode: supports maintenance, updates, synchronization, offline model updates, security patches, and requested fine-tuning. [3]

The proposed DGUI HUB NET deployment model uses the Docking Station as the physical enterprise boundary at which a deployed agentic workload can be received and instantiated.

### 6.3 Enterprise Deployment
A company receives INSTRUCT.zip at its Docking Station. DGUI Docking Agents validate the package locally, establish the approved runtime, and instantiate the assigned Individual AI Agent as a 1:1 operational agent instance.

The term 1:1 refers to equivalence of the validated agent structure/configuration for the assignment. It does not imply a copy of the person's consciousness, unrestricted identity, or private information.

### 6.4 Client Docking Station Bootstrap *(implementation)*
The company Docking Station receives work; a **client Docking Station** is what a second laptop or device runs so it can join a connection that *ships work back out* (a dock runtime on the requester/provider side). It is bootstrapped entirely through the `dgui` CLI, distributed as the npm package `@deckergui/cli`, and requires **no superuser (root/administrator) privileges**.

The bootstrap runs through four sub-commands:

- **`dgui dock check`** — verifies the device prerequisites: Node.js ≥ 18, npm, git, and at least one tunnel tool (`cloudflared` or `ngrok`); locates the DeckerGUI checkout (explicit `--repo`, else `$DGUI_ROOT`, else an upward directory walk from the working directory); confirms dependencies are installed and reads the `~/.deckergui` config; and live-probes an already-running dock on its health endpoint.
- **`dgui dock setup`** — scaffolds the per-user config directories without touching system paths:
  - `~/.deckergui/dock.env` — the runtime environment (`DGUI_HUB_URL`, `DGUI_AGENT_URL`, `DGUI_EMITTER_URL`, `DGUI_KPI_URL`, `PORT`, `DGUI_VENDOR_NAME`, `DGUI_DOCK_AGENT_ID`, `DGUI_DOCK_DATA`); values are written with forward slashes so `export $(cat ~/.deckergui/dock.env)` works in bash.
  - `~/.deckergui/node.json` — a stable device/agent identity (`nodeId`, `role`, `linkKinds`).
  - Runs `npm ci` in `docking-station/` and `dgui-cli/` when their dependencies are missing (or always with `--force`), then performs a best-effort `npm link` so `dgui` is available on `PATH` — if linking is blocked, setup prints a fallback (npx/global) instead of failing.
  - Setup is idempotent: a second run with everything in place short-circuits and re-prints the five next steps.
- **`dgui dock up`** — launches the Docking Station service detached from the terminal and polls its `/health` route (up to 10 s) until the dock reports ready.
- **`dgui dock status`** — probes the `/health` endpoint of a running dock and reports its state.

The Docking Station service itself (`docking-station/`) is a small standalone Node/Express runtime: it reads `DGUI_EMITTER_URL`, `DGUI_VENDOR_NAME`, `DGUI_DOCK_AGENT_ID`, and `DGUI_DOCK_DATA`, serves its own port (`PORT`; default 3016) and is reachable across a `cloudflared`/`ngrok` tunnel — the established cross-device path between the two laptops of a real-world test. Once bootstrapped, the second device registers a connection (e.g. `dgui hubnet connect`) and can execute assigned work while the HUB NET lifecycle (§8.1) and telemetry (§7.4) govern the assignment.

### 6.5 Tufty Boot, the Gated Inference Router, and SDK-Config Inference Sufficiency *(implementation)*
Tufty turns DeckerGUI OS on (§6.1); the gated inference router keeps the running OS supplied. The OS is only as capable as the inference it can reach, and the router plus SDK-config routing guarantee it is never starved.

**The gated inference router.** The stack exposes a single loopback, OpenAI-compatible endpoint (`dgui gate up`) in front of every upstream provider (Gemini, Claude, GPT, Grok, DeepSeek). Clients speak one schema; the router holds upstream credentials in the local key store, applies per-feature policy and quota, and swaps providers without any client change. It is the piece that turns "many providers" into one dependency the OS can trust.

**SDK-config routing.** Provider configuration lives in `DeckerConfig.json`: each provider preset declares its base URL, API-key environment variable, and its model catalog. Each feature therefore routes to an adequate upstream model — text, vision, and voice — and the provider can be swapped entirely through configuration, with no client change. Gemini is the default (`DeckerConfig.json` → `ai.provider = "gemini"`, `VITE_GEMINI_API_KEY`), consumed via `@google/genai` for text/vision, embeddings, and the Live API (voice).

**Inference sufficiency.** Three properties make the configured upstream set sufficient to power the Agentic OS:

- **Breadth.** One schema fronts every upstream provider (Gemini, Claude, GPT, Grok, DeepSeek), each with a text/vision/voice model catalog, so no feature depends on a single model and no single provider outage starves the OS.
- **Modes.** Routing honors the Cloud / Local / Enterprise operating modes already defined by DeckerGUI OS (§3.1, §3.4), so each feature is served by an adequate model at the right locality and cost.
- **Governance.** Per-feature policy and quota are enforced at the router, and per-persona Digital API Keys meter execution independently of the operator path (§9.3) — "enough inference" is governed, not assumed.

Together, Tufty establishes the boot identity, HUB NET supplies governed work, and SDK-config routing guarantees the upstream inference that powers the Agentic OS is sufficient and swappable without any client change.

## 7. Runtime, Networking, and Telemetry

### 7.1 Centralized HUB NET Database
The proposed centralized database records the coordination state of DGUI HUB NET. A deployment event can include Agent ID, Persona ID, User ID, Company ID, Assignment ID, deployment status, start time, runtime status, and completion state.

This produces a chain of custody for the digital worker from assignment through completion.

### 7.2 gRPC and WebRTC Compatibility
The architecture proposes gRPC and WebRTC compatibility as connectivity mechanisms. gRPC can support structured service-to-service communication between DGUI components, while WebRTC can support appropriate real-time peer/session communication.

These technologies are transport mechanisms, not definitions of the Persona or agent identity. The final protocol selection, authentication, encryption, NAT traversal, service discovery, and observability mechanisms remain implementation work.

### 7.3 User and Company Transparency
Each work session should be associated with both the Individual/User and the Company. A conceptual event chain is:

User → Persona → Agent → Assignment → Company → Session → Query/Tool Event → KPI Event → Completion.

The design goal is bilateral transparency and record keeping. Exact query retention, privacy controls, redaction, access permissions, and legal retention periods must be defined before production deployment.

### 7.4 Runtime Status and Live Deployment Telemetry (implementation)
Once a fleet leaves the demand board and a deploy handoff has begun, the DGUI HUB NET MAP (DeckerGUI OS map view) surfaces **where** fleet markers are and **what phase** each deployed fleet is in right now. The implementation separates two concerns:

- **Lifecycle state machine** (§8.1) — the authoritative progression `REQUESTED → MATCHED → VALIDATING → MINTED → DEPLOYED → ACTIVE → COMPLETED → REWARDED → ARCHIVED`. It moves only through the defined transitions and governs what an assignment legally *is*.
- **Live deployment telemetry** — a soft overlay that never moves the state machine. It records the fleet's current working phase so dashboards can show "waiting / preparing / executing / paused / done / failed" without mutating assignment semantics.

**Telemetry model.** A `LiveDeployStatus` is one of `QUEUED | PREPARING | EXECUTING | PAUSED | COMPLETED | FAILED`, attached to an assignment as `liveStatus` with optional `liveStatusDetail` (free-text, e.g. "batch 3/14"), `liveStatusPct` (0–100, clamped), and `liveStatusAt` (epoch ms of the last report). Telemetry is reported by the executor (the Docking Station or any dock runtime) through the operator-gated route `POST /api/emitter/hubnet/assignments/:id/status` (body `{status, detail?, pct?}`). Only assignments already in the deployed region of the lifecycle (`DEPLOYED | ACTIVE | COMPLETED | REWARDED`) accept reports; a pre-deploy assignment returns `409 "assignment not deployed yet — deploy handoff first"`, an unknown status value returns `409` with the valid enum list, and an unknown assignment returns `404`. The same passkey operator gate as §9.2 covers the route, so telemetry injection is fail-closed like every other mutating action.

**Map display status.** The HUB NET MAP derives the marker phase as `liveStatus ?? lifecycle state`, so a fleet shows correctly even before its first telemetry report: `MINTED → WAITING`, `DEPLOYED → PREPARING`, `ACTIVE → EXECUTING`, `COMPLETED → COMPLETED`, `REWARDED → PAYOUT`. Request-board demand states (`REQUESTED / MATCHED / VALIDATING`) are intentionally excluded from map markers so demand pins and deployed fleets never visually collide. Markers render the company anchor position (assignment `lat/lng` when present, otherwise the same-company anchor), a phase-colored glyph and pulse, a mini status chip, and a tooltip with role, company, phase, detail/pct, and fleet id. A "DEPLOYED FLEETS" legend with per-phase counters and a light polling refresh (6 s) keep the map live without operator intervention.

This closes the §7.1 chain-of-custody loop at the *presentation* layer: an operator can watch a fleet transition from `WAITING` through `PREPARING` to `EXECUTING` on the map while the underlying ledger still holds an authoritative, audit-only lifecycle record.

### 7.5 Coordinator Hub Services *(implementation)*
The runtime backbone between the Emitter and the rest of the ecosystem is the **Coordinator hub** (the HUB NET Relying Party/coordination service at `hub.deckergui.my`). It contributes three runtime features that the lifecycle, map, and federation layer depend on:

- **SSE event fan-out.** The hub streams live events to subscribed clients (web pages, CLIs, docks) over Server-Sent Events, so connection approvals, assignment transitions, and telemetry reports appear without polling.
- **Heartbeat registry.** Agents and Docking Stations register and periodically renew heartbeats; the registry tracks liveness across the fleet and feeds the availability signals that dashboards and the map's legend use.
- **CaaS `/context/*` federation.** The hub exposes a metered Context-as-a-Service API — `GET /context/*` under a two-layer Enterprise key gate — letting partner applications and external agents pull validated ecosystem context (seed status, DGM results, context sessions) under quota. This is the federation surface that @deckergui/cli's `dgui context` and the agent-tooling layer (§10 of the ecosystem whitepaper) use.
- **Passkey Relying Party.** The same hub hosts the WebAuthn Relying Party described in §9.2, keeping operator identity at the network edge rather than on the Emitter.

The hub therefore carries *coordination* traffic (events, heartbeats, context, identity) while the Emitter owns *state* (the ledger, lifecycle, minting) — a separation that keeps the Emitter's mutation surface small and the fan-out fast.

## 8. Digital Workforce Lifecycle

### 8.1 Lifecycle State Machine
The proposed lifecycle is:

REQUESTED → MATCHED → VALIDATING → MINTED → DEPLOYED → ACTIVE → COMPLETED → REWARDED → ARCHIVED/AVAILABLE.

Each transition should generate a machine-readable event. Failed validation should terminate or return the assignment to an appropriate pre-deployment state.

### 8.2 Example: Individual-to-Company Deployment
An individual first develops or receives a DGUI PERSONA. The Persona initializes an agent swarm appropriate to the individual's authorized capabilities. The swarm becomes eligible for DGUI HUB NET. A company either requests a capability or accepts a suitable assignment. DGUI Emitter validates the agent package, mints the Docking Agent, and produces INSTRUCT.zip. The company Docking Station receives the package and instantiates the 1:1 agent instance. During the work period, events and KPI records are associated with both the user and company. On completion, the company can issue a Reward Key through DGUI Emitter Studio.

### 8.3 Reward Key
A Reward Key is defined in this architecture as an exclusive AI tooling or computational benefit issued by the company that sponsored the work. The key may provide access to company-sponsored cloud computing, inference capacity, AI tools, or other defined benefits.

The Reward Key is therefore part of the proposed digital workforce incentive loop, not a replacement definition for salary, employment compensation, or legal remuneration.

## 9. Security, Governance, and Trust Model

### 9.1 Governance Before Execution
The DeckerGUI Agentic Market architecture places DGM governance, approved MCPs, approved tools, and approved skills before secure execution. [4] DGUI HUB NET should preserve the same principle: an agent should not gain enterprise authority merely because it can connect to a company.

Enterprise authority must be assigned explicitly and constrained by the deployment contract.

### 9.2 Identity and Authorization
The architecture should separate User Identity, Persona Identity, Agent Identity, Assignment Identity, Company Identity, and Session Identity. This separation prevents a runtime agent from being treated as the human owner and makes lifecycle auditing possible.

**Passkey operator authorization (implementation).** Operator-grade mutating actions on the DGUI Emitter (dock/manifest approve, connection approve/reject/reward, assignment advance/reward/deploy, reward grant, ad-hoc job creation, fleet mutation, hubnet seeding) are gated by a WebAuthn passkey Relying Party hosted on the HUB NET coordinator hub. The RP origin is `https://hub.deckergui.my`; a human operator registers a device-bound passkey (supported cross-device via the browser's QR-based "use a passkey from another device" flow, e.g. iPhone Camera/Passwords on iOS 17+) and later unlocks a scoped session token.

- **Fail-open default, surgically armable.** The emitter gate is controlled by a `PASSKEY_GATE` environment flag (default off). While off, the system behaves exactly as before; when armed, every mutating dock/hubnet route fails closed — no token → `401` with the unlock URL; rejected token → `401`; hub unreachable → `503`. Read and telemetry endpoints remain open so dashboards and ledger read-back are never blocked by operator presence.
- **Token scope and lifetime.** An unlocked session mints a `HUB_OPERATOR`-scoped token (12-hour TTL) using a path-verified HMAC derived from the hub's local credential secret — no naked JWK dependency, no raw API key on the wire. Attestation/assertion challenges expire after 5 minutes and are single-use.
- **Origin binding.** Relying-Party ID and origin must match the tunneled production hostname; bound to `hub.deckergui.my`, so a passkey registered on the public origin is not replayable against a loopback session.

### 9.3 Credential Handling
The Agentic Market material defines a Seed Agent for credential governance, including API seed management, provider validation, credential rotation, temporary runtime tokens, and prevention of direct API-key exposure. [4] This mechanism can be integrated with the proposed Docking Agent lifecycle, subject to implementation validation.

**Operator credential handling (implementation).** The hub stores passkey registrations (PublicKeyCredential records) in a local JSON store and keeps an HMAC secret in a file beside it — not in the emitter's SQLite ledger, so dock traffic and operator credentials share no storage surface. The customer-held API keys (e.g. the JEV typesafe-AI key) are seeded per persona and never routed through the operator path. Token verification is stateless at the peer (the emitter) and stateful at the issuer (the hub), so a revoked store or rotated secret immediately invalidates outstanding operator tokens.

### 9.4 Privacy and Data Boundaries
Because work queries may be associated with both users and companies, privacy-by-design is required. The architecture should support data minimization, explicit access controls, audit trails, retention rules, redaction where required, and separation of personal Persona data from enterprise work data.

The architecture described here does not establish legal compliance by itself; production deployment requires jurisdiction-specific review and organizational policy.

## 10. Application Scenarios

### 10.1 Individual Workforce Participation
A normal individual can maintain a DGUI Persona and make an eligible agent swarm available for suitable Digital Jobs. The same infrastructure can support different levels of capability as the Persona evolves.

### 10.2 Accessibility
The architecture separates physical circumstances from digital capability. For example, a person with a mobility disability may use an accessible DGUI interface while participating in software engineering or other digital work. The system should evaluate capability and authorization rather than physical mobility as a proxy for digital competence.

### 10.3 Experienced Retiree
An experienced professional can contribute selected, validated knowledge through a Persona. For example, maintenance expertise may be structured into knowledge, inspection, troubleshooting, documentation, compliance, and audit agents. Human validation remains essential for safety-critical industrial knowledge.

### 10.4 Enterprise Use
An enterprise can request a Digital Job, receive an eligible agentic workforce package, deploy it through the Docking Station, and track the assignment lifecycle. The architecture is intended to support both enterprise-controlled inference and approved external inference providers.

## 11. Evaluation Plan

### 11.1 System Evaluation
The source hardware specifications identify setup/connection time, offline inference latency and reliability, docking synchronization success, security compliance, unauthorized-access prevention, and user satisfaction as evaluation metrics. [2] The proposed HUB NET layer adds:

• Assignment matching latency.
• Emitter validation success/failure rate.
• INSTRUCT.zip deployment success rate.
• 1:1 instantiation integrity.
• gRPC/WebRTC session reliability.
• Event delivery latency.
• KPI record completeness.
• Work-session reconciliation accuracy.
• Reward issuance success rate.
• Recovery from disconnected or failed Docking Stations.

### 11.2 No Experimental Claims
No experimental measurements are claimed in this whitepaper. The architecture is a proposed technical design assembled from the supplied DeckerGUI Phase 1–3 material and the DGUI Agentic Market concept. Benchmarking and production validation remain future work.

## 12. Analysis and Discussion

### 12.1 Why the Architecture Matters
The principal architectural shift is from an AI assistant model to a digital workforce lifecycle. The model provider becomes one replaceable component. The agent framework becomes another implementation layer. DeckerGUI's value is concentrated in the coordination, governance, deployment, hardware integration, telemetry, and workforce lifecycle around those components.

### 12.2 Strengths
The proposed architecture provides clear separation between human identity and AI execution, supports multiple inference providers, supports multiple agent runtime families, introduces an explicit enterprise deployment boundary, creates traceable assignment state, and links work completion to a defined reward mechanism.

### 12.3 Limitations
The design remains conceptual in several areas. The HUB NET data model and service interfaces are now implemented and running on the DeckerGUI Emitter and CLI (§4, §5), and the client docking bootstrap (§6.4) removes the superuser-install barrier for real devices, but the full loop has not yet been exercised end-to-end across two physical machines under the passkey-locked operator gate. gRPC/WebRTC interoperability is proposed but not experimentally demonstrated. The three-layer Emitter validation pipeline (§5.2) is implemented as the ledger gate that must pass before minting, yet still requires the full swarm-ready manifest path to be observed on production volumes. Reward Key economics, rights, expiry, transferability, and accounting treatment also require specification.

## 13. Conclusion and Future Work

### 13.1 Conclusion
We presented DGUI HUB NET as a proposed architecture for connecting individual human capabilities to enterprise digital work through DGUI PERSONA, DGUI Agent Swarm, DGUI Emitter, DGUI Docking Agents, INSTRUCT.zip, the Docking Station, the Tufty/Decker device, and DeckerGUI OS.

The central lifecycle is:

Individual → Persona → Swarm → HUB NET → Assignment → Emitter Validation → Mint → Docking Agent → Enterprise Dock → Work → KPI/Audit → Reward Key.

This architecture positions DeckerGUI as an integration and governance system around agentic work rather than as a single AI model. It preserves the distinction between the person, the person's digital capability representation, the deployed AI agents, the enterprise runtime, and the inference provider.

A delivered realization of this design is already live: the DeckerGUI Emitter persists connections and assignments in a durable `node:sqlite` ledger, enforces the lifecycle state machine and the operator passkey gate, exposes the HUB NET MAP telemetry overlay, and records `i2i / i2e / e2e` link topologies; the `dgui` CLI drives the whole loop from a terminal and bootstraps a client Docking Station on a second device with no superuser rights (§4.4, §6.4, §7.4, §9.2). DeckerGUI OS itself is turned on by the DGUI Tufty device key (the Enter-OS gate, §6.1) and kept supplied by the gated inference router configured through `DeckerConfig.json` (§6.5), so the same connector that ignites the OS also anchors its inference.

### 13.2 Future Work
The next milestone is a real two-laptop end-to-end run: bootstrapping a client Docking Station on a second machine, tunneling it, registering an `i2e`-linked assignment, and driving the lifecycle under the passkey-locked operator gate. Beyond that: secure package signing and verification for deployment artifacts, Claw/Hermes/custom runtime adapters at scale, validated gRPC and WebRTC communication paths, Persona versioning, evaluation of KPI and telemetry integrity under load, and an experimental study of the Reward Key mechanism including rights, expiry, transferability, and accounting treatment.

## 14. Terminal and Package Ecosystem *(implementation)*

The entire HUB NET lifecycle is operable from a terminal, and the terminal tooling is distributed as a versioned package so any device — including a fresh client Docking Station — can join without a build step.

### 14.1 @deckergui/cli (npm)
The operator console is **`@deckergui/cli`**, published to the npm registry and installed as the `dgui` (and `deckergui`) binary. Version **1.12.0** is the current release. Its command families:

| Group | Commands | Purpose |
|---|---|---|
| hubnet | `connect`, `approve`, `assign`, `list` | Connections (with `--link i2i\|i2e\|e2e`), approvals, assignments; the connections list (§4.4) |
| dock | `check`, `setup`, `up`, `status` | Client Docking Station bootstrap (§6.4) |
| persona / afm | `persona`, `afm` | Persona capture (§3.2) and Agent Fleet Manager swarms (§3.3) |
| keys | `keys` | Digital API Keys seeded per persona (§9.3) |
| status / monitor / events | `status`, `monitor`, `events` | Service health-check, live monitoring, SSE event stream |
| shell | `shell` | Interactive REPL (status/agents/kpi/run/audit/health/help/clear/exit, tab completion) |
| agents / counters | `agents`, `counters` | Fleet agent views and KPI counters |
| context / seeds / dgm | `context`, `seeds`, `dgm` | CaaS context (§7.5), corpus/seed state, DGM gate queries |
| schedule / audit / modes / tufty | `schedule`, `audit`, `modes`, `tufty` | Cron schedules, audit trail, boot modes, Tufty interactions |
| transport utilities | `sse`, `tufty` | SSE event stream, device utilities |

The npm package ships prebuilt `dist/` (TypeScript → tsc), carries `files: ["dist"]`, defines both `dgui` and `deckergui` bin entries, and publishes every release to `https://registry.npmjs.org/@deckergui/cli`. It is the recommended way to install on a machine with Node.js; the Go mirror (`dgui-cli-go`) and the packaged standalone binaries cover machines without a runtime.

### 14.2 @deckergui/protocol
The shared schema package (`@deckergui/protocol`) defines the zod-validated contracts — connections, assignments, rewards, telemetry, context — that the Emitter, hub, docks, and CLI validate against. It is the single source of truth for wire shapes and prevents drift between the TypeScript stack and the Go CLI.

### 14.3 Distribution
- **npm:** `@deckergui/cli` (current: 1.12.0) — primary path for the client Docking Station bootstrap.
- **Standalone binaries:** GitHub release **`dgui-v2.0.0`** — 8 binaries (`dgui`/`deckergui` × win/mac/linux) plus source archives.
- **Repo convention:** the Enterprise KPI Tokenizer and the deepseek harness live in their own standalone private repositories; the main DeckerGUI repository carries the ecosystem, this whitepaper, and the CLI source.

## 15. Feature Coverage Index

The table below maps every feature surfaced by the publishing layer (`DGUI_Official_Publish_Paper.md`) to the technical whitepaper section that specifies it, so no feature ships without a specification.

| Publish-paper feature | Spec |
|---|---|
| HUB NET connections (link topologies i2i/i2e/e2e) | §4.4 |
| Request and assignment model | §4.3 |
| Lifecycle state machine + reward | §8.1, §8.3 |
| DGUI Emitter (validation, minting) | §5 |
| Live deployment telemetry + HUB NET MAP | §7.4 |
| Docking Station (vendor) | §6.2, §6.3 |
| Client Docking Station bootstrap (`dgui dock`) | §6.4 |
| Coordinator hub (SSE, heartbeats, CaaS, passkey RP) | §7.5, §9.2 |
| Operator authorization (WebAuthn passkey, HUB_OPERATOR) | §9.2, §9.3 |
| Terminal & package ecosystem (`@deckergui/cli`, `@deckergui/protocol`) | §14 |
| DGUI PERSONA, Agent Swarm, AFM | §3.2, §3.3 |
| Tufty device — OS boot connector / Enter-OS gate | §6.1, §6.5 |
| Gated inference router + SDK-config routing (upstream model sufficiency) | §6.5 |
| Runtime/networking (gRPC/WebRTC readiness, trust) | §7.2, §9.4 |
| Vision core (DGUIYOLOMoE, TCR, JEPA), CTAX-Ai, CORPUSLIB, DGUI Edu | Ecosystem whitepaper `WHITEPAPER.md` (design sections) |

## References
[1] DeckerGUI Project, “Phase 1 Overview – DeckerGUI Project,” supplied project specification, 2025.
[2] DeckerGUI Project, “Phase 2 Overview — Decker Hardware Integration,” supplied project specification, 2025.
[3] DeckerGUI Project, “DeckerGUI Docking Station (Phase 3) Overview,” supplied project specification, 2025.
[4] Wan Mohd Azizi Bin Wan Hosen (WMAi), “Beyond AI Agents: Building a Digital Workforce Operating System,” DeckerGUI Agentic Market, supplied project material, 2026.

## Author and Project
**Project:** DeckerGUI OS Ecosystem  
**Author:** Wan Mohd Azizi Bin Wan Hosen (WMAi)  
**Role:** Founder, Agentic AI Engineer — Researcher and Developments
