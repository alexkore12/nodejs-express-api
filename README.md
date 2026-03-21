# Node.js Express API

API RESTful construida con Node.js y Express - Versión mejorada 1.1.0

## 🚀 Características

- **Express.js** - Framework web minimalista y flexible
- **Helmet** - Headers de seguridad HTTP
- **CORS** - Control de accesos cross-origin
- **Rate Limiting** - Protección contra DDoS
- **Joi** - Validación de esquemas
- **Morgan** - Logging de HTTP requests
- **UUID** - Identificadores únicos por request
- **Logging estructurado** - Logs en formato JSON
- **TypeScript-ready** - Estructura preparada

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
  "timestamp": "2026-03-21T12:00:00Z",
  "uptime": 3600,
  "uptime_formatted": "1h 0m 0s",
  "version": "1.1.0",
  "environment": "development",
  "memory": {
    "rss": "45MB",
    "heapUsed": "28MB"
  }
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
| `RATE_LIMIT_WINDOW` | Ventana de rate limit (ms) | `900000` |
| `RATE_LIMIT_MAX` | Máximo requests | `100` |

## 📁 Estructura del Proyecto

```
nodejs-express-api/
├── src/
│   ├── index.js              # Entry point (v1.1.0)
│   ├── routes/
│   │   └── api.js           # Rutas de API
│   ├── middleware/
│   │   ├── errorHandler.js  # Manejo de errores
│   │   └── logger.js        # Logging estructurado
│   └── models/              # Modelos de datos
├── package.json
├── Dockerfile
├── docker-compose.yaml
├── .env.example
└── README.md
```

## 🔒 Seguridad

### Headers de Seguridad (Helmet)

- ✅ Content Security Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security

### Rate Limiting

- ✅ 100 requests por IP cada 15 minutos
- ✅ Headers estándar (RateLimit-*)

### Validación

- ✅ Joi schemas para validación de input
- ✅ Límite de tamaño de payload (10kb)
- ✅ Sanitización de entrada

### Headers de Response

- ✅ X-Request-ID - ID único por request
- ✅ X-Response-Time - Tiempo de procesamiento

## 🧪 Testing

```bash
# Instalar dependencias de test
npm install --save-dev jest supertest

# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

## 📊 Logging

La API genera logs estructurados en formato JSON:

```json
{
  "timestamp": "2026-03-21T12:00:00Z",
  "level": "info",
  "message": "Request processed",
  "method": "GET",
  "path": "/api/items",
  "status": 200,
  "duration": 45
}
```

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

### v1.1.0 (2026-03-21)
- ✅ Añadido rate limiting
- ✅ Logging estructurado JSON
- ✅ Health check mejorado con métricas de memoria
- ✅ UUID por request
- ✅ Validación de tamaño de payload
- ✅ Headers de response mejorados

### v1.0.0 (2026-03-20)
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
