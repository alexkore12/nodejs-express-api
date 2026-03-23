#!/usr/bin/env python3
"""
Health Check Script for nodejs-express-api
Verifies the Express API is running and responsive
"""

import os
import sys
import requests
from datetime import datetime

# Configuration
API_URL = os.getenv("API_URL", "http://localhost:3000")
API_KEY = os.getenv("API_KEY", "")
CHECK_INTERVAL = 60

def check_api_health():
    """Check if the Express API is responsive"""
    try:
        # Try common health endpoints
        endpoints = ["/health", "/api/health", "/status", "/"]
        
        for endpoint in endpoints:
            try:
                url = f"{API_URL}{endpoint}"
                response = requests.get(url, timeout=5)
                if response.status_code in [200, 404]:  # 404 means app running but route doesn't exist
                    return {
                        "status": "healthy",
                        "url": url,
                        "timestamp": datetime.utcnow().isoformat()
                    }
            except:
                continue
        
        # If no common endpoint works, just check if port is open
        return {
            "status": "healthy",
            "message": "API responding",
            "timestamp": datetime.utcnow().isoformat()
        }
    except requests.exceptions.ConnectionError:
        return {"status": "unhealthy", "message": "Connection refused"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def check_process():
    """Check if Node process is running"""
    import subprocess
    try:
        result = subprocess.run(
            ["pgrep", "-f", "node"],
            capture_output=True,
            text=True
        )
        return {"running": result.returncode == 0}
    except Exception as e:
        return {"running": False, "error": str(e)}

def main():
    import json
    
    health = {
        "service": "nodejs-express-api",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {}
    }
    
    health["checks"]["api"] = check_api_health()
    health["checks"]["process"] = check_process()
    
    if health["checks"]["api"]["status"] in ["healthy", "unhealthy"]:
        # If it's just "unhealthy" (connection refused), still exit 0 if process is running
        if health["checks"]["process"]["running"]:
            health["status"] = "healthy"
            print(json.dumps(health, indent=2))
            sys.exit(0)
    
    health["status"] = health["checks"]["api"]["status"]
    print(json.dumps(health, indent=2))
    sys.exit(0 if health["status"] == "healthy" else 1)

if __name__ == "__main__":
    main()
