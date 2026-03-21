# Node.js Express REST API

API RESTful construida con Node.js y Express, lista para producción.

## ⚡ Inicio Rápido

```bash
# Instalación
npm install

# Desarrollo
npm run dev

# Producción
npm start

# Tests
npm test
```

## 🎯 Características

- **Express.js** - Framework web minimalista
- **Validación** - Joi schema validation
- **Seguridad** - Helmet, CORS, Rate Limiting
- **Logging** - Morgan para logs de HTTP
- **ESM/CommonJS** - Compatible con ambos
- **TypeScript-ready** - Estructura preparada
- **Docker** - Lista para producción
- **PM2** - Gestión de procesos para producción

## 📂 Estructura del Proyecto

```
src/
├── index.js              # Entry point
├── routes/
│   └── api.js           # Rutas de API
├── middleware/
│   ├── errorHandler.js  # Manejo de errores
│   ├── rateLimiter.js   # Rate limiting
│   └── validator.js     # Validación Joi
├── models/              # Modelos de datos
├── services/           # Lógica de negocio
└── utils/              # Utilidades
```

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/items | Listar todos los items |
| GET | /api/items/:id | Obtener item por ID |
| POST | /api/items | Crear nuevo item |
| PUT | /api/items/:id | Actualizar item |
| DELETE | /api/items/:id | Eliminar item |

## Ejemplo de Request

```bash
# Crear item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Producto 1", "price": 99.99}'

# Listar items
curl http://localhost:3000/api/items
```

## 🛡️ Seguridad

### Headers de Seguridad (Helmet)

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### CORS Configurado

```javascript
import cors from 'cors';
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
```

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo requests por IP
});
app.use('/api/', limiter);
```

### Validación de Input

```javascript
import Joi from 'joi';

const itemSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().max(500).optional()
});
```

## ⚙️ Configuración

Variables de entorno (`.env`):

```env
# Server
PORT=3000
NODE_ENV=development

# Security
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

USER node

EXPOSE 3000

CMD ["node", "index.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Construcción y Ejecución

```bash
# Build
docker build -t myapi:latest .

# Run
docker run -p 3000:3000 myapi:latest

# Docker Compose
docker-compose up -d
```

## 🧪 Testing

```bash
# Instalar dependencias de test
npm install --save-dev jest supertest

# Ejecutar tests
npm test

# Coverage
npm run test:coverage
```

## 📊 Logging

Morgan está configurado para logs de HTTP:

```bash
# Formato combinados
npm start

# Logs en archivo
LOG_FILE=./logs/app.log npm start
```

Formatos disponibles:
- `combined` - Logs detallados
- `common` - Logs básicos
- `dev` - Desarrollo a color

## 🚀 Despliegue

### PM2 (Produccción)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start src/index.js --name myapi

# Ver logs
pm2 logs myapi

# Restart automático
pm2 startup
```

### Environment Production

```bash
# Variables requeridas
export NODE_ENV=production
export PORT=3000
export ALLOWED_ORIGINS=https://tudominio.com
```

## 📈 Métricas

### Health Check

```json
{
    "status": "healthy",
    "uptime": 123456,
    "timestamp": "2026-03-21T12:00:00Z"
}
```

## 🔧 Mantenimiento

### Dependencias

```bash
# Ver dependencias obsoletas
npm outdated

# Actualizar
npm update

# Actualizar major (cuidado)
npm install package@latest
```

### Performance

- Usar clustering para múltiples cores
- Habilitar gzip compression
- Cachear respuestas estáticas
- Usar CDN para assets

## Contributing

1. Fork
2. Create feature branch
3. Commit
4. Push y PR

## Licencia

MIT
