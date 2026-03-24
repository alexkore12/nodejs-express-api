# 🚀 Node.js Express REST API

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)
[![Security: Grype](https://img.shields.io/badge/Security-Grype-orange.svg)](.grype.yaml)

## 📋 Descripción

API REST construida con Node.js y Express, lista para producción con características de seguridad y rendimiento.

## ✨ Características

- ⚡ **Alto Rendimiento**: Node.js + Express optimizado
- 🔒 **Seguridad**: Helmet, CORS, Rate Limiting
- 📝 **API Documentation**: Swagger/JSDoc
- 🐳 **Docker Ready**: Multi-stage builds
- 🔍 **Security Scanning**: Escaneo con Grype
- 📊 **Logging**: Morgan + Winston
- 💉 **Dependency Injection**: Patrón simple

## 🚀 Instalación

### Prerequisites
- Node.js 20+
- npm o yarn
- Docker (opcional)

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/alexkore12/nodejs-express-api.git
cd nodejs-express-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

### Producción

```bash
# O ejecutar en producción
npm start
```

### Con Docker

```bash
# Construir imagen
docker build -t nodejs-express-api .

# Ejecutar
docker run -p 3000:3000 --env-file .env nodejs-express-api
```

### Con Docker Compose

```bash
docker-compose up -d
```

## ⚙️ Configuración

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 3000 |
| `NODE_ENV` | Entorno | development |
| `LOG_LEVEL` | Nivel de logging | info |
| `API_RATE_LIMIT` | Límite de requests/min | 100 |
| `CORS_ORIGIN` | Origenes CORS permitidos | * |

## 📖 Documentación API

Una vez ejecutando, visita:
- **Swagger UI**: http://localhost:3000/api-docs

## 🏗️ Estructura del Proyecto

```
nodejs-express-api/
├── .dockerignore
├── .env.example
├── .github/workflows/
│   └── ci.yml
├── .gitignore
├── .grype.yaml
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── Dockerfile
├── LICENSE
├── Makefile
├── MONITORING.md
├── README.md
├── SECURITY.md
├── docker-compose.yml
├── index.js                 # Legacy entry (deprecated, use src/)
├── package.json
├── rate-limiter.js
├── scripts/
│   └── setup.sh
├── src/
│   ├── index.js             # Entry point principal
│   ├── auth.js              # Authentication logic
│   ├── healthcheck.js       # Health check endpoints
│   ├── mcp-server.js        # MCP server integration
│   ├── middleware/
│   │   ├── auth.js          # Auth middleware
│   │   ├── errorHandler.js  # Global error handler
│   │   └── security.js      # Security headers (Helmet)
│   └── routes/
│       └── api.js           # API route definitions
└── tests/
```

## 📝 API Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | No |
| GET | `/api/v1/status` | Estado de la API | No |
| POST | `/api/v1/auth/login` | Login | No |
| GET | `/api/v1/auth/me` | Usuario actual | Yes |
| GET | `/api/v1/items` | Listar items (paginación) | Yes |
| POST | `/api/v1/items` | Crear item | Yes |
| GET | `/api/v1/items/:id` | Obtener item por ID | Yes |
| PUT | `/api/v1/items/:id` | Actualizar item | Yes |
| DELETE | `/api/v1/items/:id` | Eliminar item | Yes |

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con coverage
npm run test:coverage

# Modo watch
npm run test:watch
```

## Seguridad

- ✅ Escaneo con Grype
- ✅ Helmet security headers
- ✅ Rate limiting configurable
- ✅ CORS configurado
- ✅ Input validation
- ✅ Security middleware (src/middleware/security.js)

Consulta [SECURITY.md](SECURITY.md) para reporte de vulnerabilidades.

## 📈 CI/CD

Workflows de GitHub Actions incluidos:
- ✅ Linting con ESLint
- ✅ Tests con Jest
- ✅ Security scanning con npm audit
- ✅ Docker build multi-stage

Ver [MONITORING.md](MONITORING.md) para detalles de monitoreo.

## 🤝 Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de contribuir.

## 📝 Licencia

MIT License - vea [LICENSE](LICENSE) para detalhes.

## 👤 Autor

- **Alex** - [@alexkore12](https://github.com/alexkore12)
