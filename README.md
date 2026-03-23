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
├── .github/workflows/ci.yml
├── .gitignore
├── .grype.yaml
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── Dockerfile
├── LICENSE
├── Makefile
├── README.md
├── SECURITY.md
├── docker-compose.yml
├── index.js
├── package.json
└── rate-limiter.js
```

## 📝 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/status` | Estado de la API |
| * | `/api/v1/*` | Endpoints de la API |

## 🔒 Seguridad

- ✅ Escaneo con Grype
- ✅ Helmet headers
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Input validation

Consulta [SECURITY.md](SECURITY.md) para reporte de vulnerabilidades.

## 🤝 Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de contribuir.

## 📝 Licencia

MIT License - vea [LICENSE](LICENSE) para detalhes.

## 👤 Autor

- **Alex** - [@alexkore12](https://github.com/alexkore12)
