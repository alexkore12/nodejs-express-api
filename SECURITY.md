# Security Policy

## 🔴 Recent Security Alerts

### Trivy Supply Chain Attack (March 2026)

**⚠️ ALERT:** Trivy versions 0.69.4 and GitHub Actions (aquasecurity/setup-trivy, aquasecurity/trivy-action) have been compromised in a supply chain attack. 

**Recommendations:**
1. **Do NOT use** Trivy v0.69.4
2. **Do NOT use** the compromised GitHub Actions
3. Use alternative scanners: Grype, Checkov
4. Pin to specific known-good versions

**For this Node.js project:**
- Use `npm audit` for dependency scanning
- Use Snyk or GitHub Dependabot
- Consider using Grype as container scanner instead of Trivy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅                 |
| < 1.0   | ❌ End of Life     |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it via GitHub Issues.

## Security Best Practices for This Project

### Dependencies
```bash
# Audit dependencies
npm audit

# Use audit in CI
npm audit --audit-level=high
```

### Production
1. **HTTPS only** - Use reverse proxy (nginx, traefik)
2. **Environment variables** - Never commit secrets
3. **Helmet** - Already configured ✅
4. **Rate limiting** - Add express-rate-limit
5. **CORS** - Restrict domains in production

### Docker Security
```bash
# Scan images with Grype instead of Trivy
grype node:18-alpine
```

---

*Last updated: 2026-03-21*
