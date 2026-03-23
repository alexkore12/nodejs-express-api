#!/bin/bash
# Monitor script for nodejs-express-api
# Usage: ./monitor.sh

set -euo pipefail

echo "🔍 Monitoring nodejs-express-api..."

PORT="${PORT:-3000}"

# Check if the process is running
if pgrep -f "node.*index.js" > /dev/null; then
    echo "✅ Node process is running"
else
    echo "❌ Node process is NOT running"
fi

# Check API health endpoint
if curl -s -f "http://localhost:${PORT}/health" > /dev/null 2>&1; then
    echo "✅ API health check OK"
else
    echo "❌ API health check FAILED"
fi

# Check Docker container
if command -v docker &> /dev/null; then
    if docker ps --format '{{.Names}}' | grep -q "nodejs-express-api"; then
        echo "✅ Docker container is running"
        docker logs --tail 5 nodejs-express-api 2>/dev/null || true
    fi
fi

# Check memory and CPU
echo "📊 System Resources:"
MEMORY_USAGE=$(free | awk '/Mem:/ {printf "%.0f", $3/$2 * 100}')
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%//')
echo "  🧠 Memory: ${MEMORY_USAGE}%"
echo "  ⚡ CPU: ${CPU_USAGE}%"

# Check disk space
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
echo "  💾 Disk: ${DISK_USAGE}%"

echo "✅ Monitoring complete"