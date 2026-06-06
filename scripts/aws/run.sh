#!/bin/sh
# Lambda Web Adapter startup script for the Next.js standalone server.
# The Web Adapter probes $PORT for readiness, then proxies API Gateway
# requests to it. Next.js standalone (`output: "standalone"`) honors PORT
# and HOSTNAME, so no application code changes are required.
set -e

export PORT="${PORT:-8080}"
export HOSTNAME="0.0.0.0"

exec node server.js
