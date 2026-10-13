#!/usr/bin/env bash
set -euo pipefail

# DGUI HUB NET — Google execution layer live demo (Cloud Run service).
#
# Boot the service first (see demo/hubnet-google.md):
#   cd services/hubnet-google && npm install && npm run build
#   PORT=8090 DGUI_HUBNET_I2I_LAN_ONLY=1 GEMINI_API_KEY=<key> node dist/index.js
#
# Then:  bash demo/hubnet-google.sh

BASE="${DGUI_HUBNET_GOOGLE_URL:-http://127.0.0.1:8090}"
J() { grep -oE "\"$1\":\"[^\"]+\"" | head -1 | cut -d'"' -f4; }

echo "=== 0. service health ==="
curl -s "$BASE/health"

echo; echo "=== 1. transport guard — i2i to a PUBLIC dock must be REJECTED ==="
curl -s -w " [http %{http_code}]\n" -X POST "$BASE/connect" -H 'content-type: application/json' \
  -d '{"afm":"afm_demo","name":"Alex AFM","company":"person_b","companyName":"Bella (Peer Reviewer)","link":"i2i","dock":"https://203.0.113.42:3198"}' \
  | head -c 600; echo

echo "=== 2. the real i2i request — Alex → Bella over the LAN dock ==="
C=$(curl -s -X POST "$BASE/connect" -H 'content-type: application/json' \
  -d '{"afm":"afm_demo","name":"Alex AFM","company":"person_b","companyName":"Bella (Peer Reviewer)","link":"i2i","dock":"http://127.0.0.1:3198"}')
echo "$C"; CID=$(printf '%s' "$C" | J connectionId)

echo "=== 3. Bella approves on her Docking Station ==="
curl -s -X POST "$BASE/approve" -H 'content-type: application/json' \
  -d "{\"id\":\"$CID\",\"vendor\":\"Bella (Peer Reviewer)\"}"; echo

echo "=== 4. Alex routes a peer-review job (individual-request) ==="
A=$(curl -s -X POST "$BASE/assign" -H 'content-type: application/json' \
  -d '{"afm":"afm_demo","role":"Peer review: coral-reef survey paper","company":"person_b","companyName":"Bella (Peer Reviewer)","user":"alex"}')
echo "$A"; AID=$(printf '%s' "$A" | J assignmentId)

echo "=== 5. persona-match gate ==="
curl -s -X POST "$BASE/advance" -H 'content-type: application/json' -d "{\"id\":\"$AID\"}"; echo

echo "=== 6. evidencing BEFORE execution — L3 has no dock agent yet ==="
curl -s -X POST "$BASE/validate" -H 'content-type: application/json' -d "{\"id\":\"$AID\"}" \
  | grep -oE '"layer":[0-9]+,"label":"[^"]+","pass":(true|false)'

echo "=== 7. the Google execution layer — Gemini mints the dock agent ==="
curl -s -X POST "$BASE/execute" -H 'content-type: application/json' -d "{\"id\":\"$AID\"}"; echo

echo "=== 8. evidencing AFTER execution — all three layers PASS (mintable) ==="
curl -s -X POST "$BASE/validate" -H 'content-type: application/json' -d "{\"id\":\"$AID\"}" \
  | grep -oE '"layer":[0-9]+,"label":"[^"]+","pass":(true|false)'

echo "=== 9. final topology ==="
curl -s "$BASE/list"; echo
