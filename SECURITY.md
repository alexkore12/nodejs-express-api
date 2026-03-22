# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

Report security issues via GitHub Issues or contact the owner.

## Security Best Practices

- Store credentials in environment variables
- Never commit .env files or secrets
- Use HTTPS in production
- Implement proper authentication (JWT, sessions)
- Enable CORS with explicit origins
- Use helmet.js for security headers
- Implement rate limiting
- Sanitize all user inputs

## Node.js Security

- Keep Node.js and npm packages updated
- Use `npm audit` for vulnerability scanning
- Enable Dependabot security alerts
- Implement proper error handling
- Use secure cookie settings
- Enable CSRF protection

## Recommended Security Packages

- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT handling
