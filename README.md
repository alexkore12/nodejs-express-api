# 🚀 Node.js Express REST API

> API REST completa con Node.js y Express, lista para producción con seguridad, documentación y testing integrados.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)
[![Security: Grype](https://img.shields.io/badge/Security-Grype-orange.svg)](.grype.yaml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

## 📋 Descripción

API REST lista para producción construida con Express.js, incluyendo autenticación JWT, validación de datos, rate limiting, logging estructurado, documentación Swagger y tests automatizados.

## ✨ Características

- ⚡ **Alto Rendimiento** - Node.js + Express optimizado con compression
- 🔒 **Seguridad** - Helmet, CORS, Rate Limiting, JWT, validación de entrada
- 📝 **Documentación** - Swagger/OpenAPI auto-generada
- 🐳 **Docker Ready** - Multi-stage builds, Alpine-based
- 🔍 **Security Scanning** - Escaneo con Grype en CI
- 📊 **Logging** - Morgan + Winston con correlación de IDs
- 💉 **Dependency Injection** - Patrón simple con factories
- ✅ **Testing** - Jest + Supertest para integración
- 🗄️ **ORM** - Prisma o Sequelize (configurable)
- 🔄 **CI/CD** - GitHub Actions configurado

## 🚀 Inicio Rápido

### Prerequisites

- Node.js 20+ 
- npm 10+ o yarn
- Docker (opcional)

### Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/alexkore12/nodejs-express-api.git
cd nodejs-express-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# Ejecutar en desarrollo
npm run dev

# O ejecutar en producción
npm run build && npm start
```

### Docker

```bash
# Construir imagen
docker build -t nodejs-express-api:latest .

# Ejecutar
docker run -p 3000:3000 --env-file .env nodejs-express-api:latest

# O con docker-compose
docker-compose up -d
```

## 📁 Estructura del Proyecto

```
nodejs-express-api/
├── .dockerignore
├── .env.example
├── .gitattributes
├── .github/workflows/ci.yml
├── .gitignore
├── .grype.yaml              # Grype vulnerability scanner config
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── deploy.sh                 # Script de despliegue
├── docker-compose.yaml
├── Dockerfile
├── health_check.py          # Health check script
├── LICENSE
├── Makefile
├── MONITORING.md            # Métricas y monitoreo
├── monitor.sh                # Script principal de monitoreo
├── package.json
├── rate-limiter.js           # Rate limiting standalone script
├── README.md
├── scripts/
│   └── setup.sh             # Script de instalación
├── SECURITY.md
├── setup.sh                 # Script de inicialización
├── src/
│   ├── index.js              # Entry point principal
│   ├── auth.js               # Lógica de autenticación
│   ├── healthcheck.js        # Endpoints de health check
│   ├── mcp-server.js         # MCP server integration
│   ├── middleware/
│   │   ├── auth.js           # Middleware de autenticación
│   │   ├── errorHandler.js   # Manejo centralizado de errores
│   │   └── security.js       # Headers de seguridad (Helmet)
│   └── routes/
│       └── api.js            # Definición de rutas API
└── tests/
    └── api.test.js           # Tests de la API
```

## 📚 API Endpoints

### Health

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check básico | No |
| GET | `/health/ready` | Readiness probe | No |

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Inicio de sesión | No |
| GET | `/auth/me` | Usuario actual | Yes |

### Items (API principal)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/items` | Listar todos los items | No |
| GET | `/api/items/:id` | Obtener item por ID | No |
| POST | `/api/items` | Crear nuevo item | No |
| PUT | `/api/items/:id` | Actualizar item | No |
| DELETE | `/api/items/:id` | Eliminar item | No |

### Ejemplos con curl

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "secret"}'

# Listar items
curl http://localhost:3000/api/items

# Crear item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Item test", "description": "Test", "price": 19.99}'

# Actualizar item
curl -X PUT http://localhost:3000/api/items/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Item actualizado"}'

# Eliminar item
curl -X DELETE http://localhost:3000/api/items/{id}
```

### Respuestas de Error

| Código | Significado |
|--------|-------------|
| 400 | Bad Request — validación fallida |
| 401 | Unauthorized — credenciales inválidas |
| 404 | Not Found — recurso no existe |
| 429 | Too Many Requests — rate limit excedido |
| 500 | Internal Server Error |

## 🔐 Seguridad

### Headers de Seguridad

```javascript
// Helmet configura automáticamente:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: SAMEORIGIN
// - X-XSS-Protection
// - Strict-Transport-Security
// - Content-Security-Policy
```

### Rate Limiting

```javascript
// Por defecto:
// - 100 requests por 15 minutos por IP
// - 1000 requests por 15 minutos para autenticados
// - Límites personalizados por endpoint
```

### Validación de Input

```javascript
// Usando express-validator
router.post('/users',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/\d/),
  userController.create
);
```

## 📝 Documentación API

Accede a la documentación Swagger en:

```
http://localhost:3000/api-docs
```

### Ejemplo de Request

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response:
# {
#   "success": true,
#   "data": {
#     "accessToken": "eyJhbGciOiJIUzI1NiIs...",
#     "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
#     "expiresIn": 3600
#   }
# }
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Con coverage
npm run test:coverage

# Tests específicos
npm test -- --grep "auth"

# Watch mode
npm run test:watch
```

### Ejemplo de Test

```javascript
describe('Auth Controller', () => {
  describe('POST /api/v1/auth/login', () => {
    it('should return 200 with tokens on valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });
  });
});
```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno (development/production) | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `JWT_SECRET` | Secret para JWT | **Requerido** |
| `JWT_EXPIRES_IN` | Expiración del token | `1h` |
| `DATABASE_URL` | URL de base de datos | **Requerido** |
| `REDIS_URL` | URL de Redis | `redis://localhost:6379` |
| `RATE_LIMIT_MAX` | Requests máximos | `100` |
| `LOG_LEVEL` | Nivel de logging | `info` |

## 🐳 Docker

```bash
# Desarrollo
docker-compose up -d

# Producción
docker build -t nodejs-express-api:prod --target production .
docker run -p 3000:3000 --env-file .env nodejs-express-api:prod
```

## 🔄 CI/CD

El repositorio incluye GitHub Actions que ejecuta:

1. **Lint** - ESLint
2. **Test** - Jest con coverage
3. **Security Scan** - Grype
4. **Build** - Docker image
5. **Deploy** - A staging/production

## 📈 Monitoreo

### Logs

```bash
# Ver logs en tiempo real
npm run logs

# Logs estructurados en JSON (producción)
npm start
```

### Métricas

- Request/Response time
- Error rate
- CPU/Memory usage
- Database query time

## 🤝 Contribuir

1. Fork → Branch → Commit → PR
2. Seguir guías de estilo (ESLint)
3. Agregar tests para nueva funcionalidad
4. Actualizar swagger.json si hay cambios de API

## 📄 Licencia

MIT - ver [LICENSE](LICENSE)

## 🔗 Recursos

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
