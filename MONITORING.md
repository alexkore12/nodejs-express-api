# Node.js Express API - Monitoring Setup

## Prometheus Metrics

The API exposes metrics at `/metrics` endpoint.

### Metrics Included

- HTTP request duration
- HTTP request count
- Error rate
- Memory usage
- CPU usage

## Grafana Dashboard

Import `grafana-dashboard.json` for visualization.

## Alerting

Configure alerts in `alerts.yaml` for:
- High error rate (>5%)
- High response time (>1s)
- Memory usage (>80%)

## Health Checks

- `/health` - Basic health check
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

