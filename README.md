# Node.js Express API

API RESTful construida con Node.js y Express - **Versión 1.1.0 con Tests**

## 🚀 Características

- **Express.js** - Framework web minimalista y flexible
- **Helmet** - Headers de seguridad HTTP
- **CORS** - Control de accesos cross-origin
- **Joi** - Validación de esquemas
- **Morgan** - Logging de HTTP requests
- **UUID** - Identificadores únicos por request
- **Logging estructurado** - Logs en formato JSON
- **Tests completos** - Jest + Supertest

## 📋 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check con métricas |
| GET | `/api/items` | Listar todos los items |
| GET | `/api/items/:id` | Obtener item por ID |
| POST | `/api/items` | Crear nuevo item |
| PUT | `/api/items/:id` | Actualizar item |
| DELETE | `/api/items/:id` | Eliminar item |

## 🛠️ Instalación

```bash
# Clonar repositorio
git clone https://github.com/alexkore12/nodejs-express-api.git
cd nodejs-express-api

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

## ▶️ Ejecución

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start

# Tests
npm test

# Tests en modo watch
npm run test:watch
```

## 🐳 Docker

```bash
# Build
docker build -t express-api .

# Run
docker run -p 3000:3000 express-api

# Docker Compose
docker-compose up -d
```

## 📖 Documentación de la API

### Health Check

```bash
curl http://localhost:3000/health
```

Respuesta:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-22T00:00:00Z",
  "uptime": 3600
}
```

### Crear Item

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto 1",
    "description": "Descripción del producto",
    "price": 99.99
  }'
```

### Listar Items

```bash
curl http://localhost:3000/api/items
```

### Obtener Item por ID

```bash
curl http://localhost:3000/api/items/{id}
```

### Actualizar Item

```bash
curl -X PUT http://localhost:3000/api/items/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto actualizado",
    "price": 149.99
  }'
```

### Eliminar Item

```bash
curl -X DELETE http://localhost:3000/api/items/{id}
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development` |
| `CORS_ORIGIN` | Origen CORS permitido | `*` |

## 📁 Estructura del Proyecto

```
nodejs-express-api/
├── src/
│   ├── index.js              # Entry point
│   ├── mcp-server.js         # MCP Server (Model Context Protocol)
│   ├── routes/
│   │   └── api.js           # Rutas de API
│   ├── middleware/
│   │   ├── errorHandler.js  # Manejo de errores
│   │   └── logger.js        # Logging estructurado
│   └── models/              # Modelos de datos
├── tests/
│   └── api.test.js          # Suite de tests (v1.1.0)
├── package.json
├── Dockerfile
├── docker-compose.yaml
├── .env.example
└── README.md
```

## 🤖 MCP Server (Model Context Protocol)

Esta API incluye un servidor MCP para integración con AI Agents.

### ¿Qué es MCP?

MCP (Model Context Protocol) es el protocolo emergente para herramientas de AI agents. Permite que modelos de IA interactúen con herramientas externas de forma estandarizada.

**Referencia**: https://modelcontextprotocol.io

### Endpoints MCP

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/mcp/tools/list` | Listar herramientas disponibles |
| POST | `/mcp/tools/call` | Ejecutar una herramienta |
| GET | `/mcp/resources/list` | Listar recursos disponibles |
| GET | `/mcp/resources/:uri` | Obtener recurso |
| GET | `/mcp/health` | Health check |

### Herramientas Disponibles

- **get_server_status**: Estado del servidor
- **search_users**: Buscar usuarios  
- **create_notification**: Crear notificación

### Ejemplo de uso

```bash
# Listar herramientas
curl http://localhost:3000/mcp/tools/list

# Obtener estado del servidor
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "get_server_status", "arguments": {"includeMetrics": true}}'
```

## 🧪 Testing

### Tests Incluidos (v1.1.0)

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm test -- --coverage

# Modo watch
npm run test:watch
```

### Cobertura de Tests

| Categoría | Tests |
|-----------|-------|
| Security Headers | ✅ X-Content-Type-Options, X-Frame-Options, X-XSS-Protection |
| Health Check | ✅ Status, timestamp, uptime |
| CRUD Operations | ✅ Create, Read, Update, Delete |
| Input Validation | ✅ Empty name, negative price, missing fields |
| Error Handling | ✅ 404, error format |

## 🔒 Seguridad

### Headers de Seguridad (Helmet)

- ✅ Content Security Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security

### Validación

- ✅ Joi schemas para validación de input
- ✅ Límite de tamaño de payload
- ✅ Sanitización de entrada

### Headers de Response

- ✅ X-Request-ID - ID único por request
- ✅ X-Response-Time - Tiempo de procesamiento

## 🚀 Despliegue Recomendado

### PM2 (Producción)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar app
pm2 start src/index.js --name express-api

# Configurar auto-reinicio
pm2 startup
pm2 save
```

### Nginx como Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 Changelog

### v1.1.0 (2026-03-22)
- ✅ Suite completa de tests (api.test.js)
- ✅ Dependencia supertest añadida
- ✅ Scripts de test mejorados
- ✅ Coverage configurado
- ✅ Documentación de tests

### v1.0.0 (2026-03-21)
- ✅ Versión inicial
- ✅ CRUD completo
- ✅ Express + Helmet + CORS + Morgan
- ✅ Joi validation

## 🤖 Generado por

Este proyecto fue creado y actualizado por **OpenClaw AI Assistant**.

## 📄 Licencia

MIT License

---

**GitHub**: [alexkore12](https://github.com/alexkore12)
