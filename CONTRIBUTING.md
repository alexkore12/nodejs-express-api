# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Node.js Express API!

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Setup de Desarrollo](#setup-de-desarrollo)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [API Development](#api-development)
- [Testing](#testing)
- [Security](#security)

## Código de Conducta

Mantén un ambiente respetuoso y profesional.

## Setup de Desarrollo

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (para desarrollo local)
- PostgreSQL o MySQL (o usar Docker)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/alexkore12/nodejs-express-api.git
cd nodejs-express-api

# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env
# Editar .env

# Instalar herramientas de desarrollo
npm install -D eslint prettier jest supertest

# Ejecutar en desarrollo
npm run dev
```

### Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener
docker-compose down
```

## Flujo de Trabajo

### Git Flow

```
main ← ← ← ← ← ← ← ← ← ←
  ↑         ↑develop
  │           ↑
  └── ─── ─── ─── feature/*
```

### Branch Naming

```
feature/users-crud        # Nueva funcionalidad
fix/auth-token-issue      # Bug fix
docs/api-documentation    # Documentación
refactor/cleanup-routes   # Refactorización
security/add-cors         # Seguridad
```

### Commits

```
feat(auth): agregar login con JWT
fix(users): corregir validación de email
docs(readme): actualizar guía de instalación
test(api): agregar tests de integración
refactor(middleware): extraer validación a función
```

## Estándares de Código

### Estructura

```
src/
├── app.js                 # Configuración de Express
├── server.js              # Entry point
├── config/                # Configuración
│   ├── index.js
│   ├── database.js
│   └── logger.js
├── routes/                # Rutas
│   ├── index.js
│   ├── users.js
│   └── auth.js
├── controllers/           # Controladores
│   ├── userController.js
│   └── authController.js
├── middleware/            # Middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── rateLimiter.js
├── models/                # Modelos
├── services/              # Servicios
├── utils/                  # Utilidades
├── validators/            # Validaciones
└── tests/                 # Tests
```

### Ejemplo de Ruta

```javascript
// routes/users.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// GET /users
router.get('/',
    auth.verifyToken,
    rateLimiter.limit(100, 15), // 100 requests por 15 min
    userController.getAll
);

// GET /users/:id
router.get('/:id',
    auth.verifyToken,
    param('id').isInt({ min: 1 }),
    userController.getById
);

// POST /users
router.post('/',
    auth.verifyToken,
    rateLimiter.limit(10, 60), // 10 requests por min
    [
        body('name').trim().notEmpty().escape(),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }).matches(/\d/)
    ],
    userController.create
);

module.exports = router;
```

### Ejemplo de Controlador

```javascript
// controllers/userController.js
const { validationResult } = require('express-validator');
const userService = require('../services/userService');

class UserController {
    /**
     * Get all users
     * @route GET /api/v1/users
     * @access Private (Admin)
     */
    async getAll(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const users = await userService.findAll({
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            });

            res.json({
                success: true,
                data: users.rows,
                pagination: {
                    total: users.count,
                    page: users.page,
                    pages: Math.ceil(users.count / users.limit)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new user
     * @route POST /api/v1/users
     * @access Private (Admin)
     */
    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await userService.create(req.body);
            
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
```

### Middleware de Error

```javascript
// middleware/errorHandler.js
const logger = require('../config/logger');

class AppError extends Error {
    constructor(message, statusCode, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message
            }
        });
    }

    // Programming or unknown errors
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Something went wrong'
        }
    });
};

module.exports = { AppError, errorHandler };
```

## API Development

### REST Conventions

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | /users | Listar usuarios | - |
| GET | /users/:id | Obtener usuario | - |
| POST | /users | Crear usuario | {name, email, password} |
| PUT | /users/:id | Actualizar | {name, email} |
| DELETE | /users/:id | Eliminar | - |

### Response Format

```javascript
// Success
{
    "success": true,
    "data": { ... },
    "meta": { ... } // opcional
}

// Error
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Email is required",
        "details": [ ... ]
    }
}
```

### Status Codes

| Code | Uso |
|------|-----|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## Testing

```bash
# Todos los tests
npm test

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Tests específicos
npm test -- --grep "auth"
```

### Ejemplo de Test

```javascript
// tests/users.test.js
const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, teardownDatabase } = require('./helpers');

beforeAll(setupDatabase);
afterAll(teardownDatabase);

describe('Users API', () => {
    describe('GET /api/v1/users', () => {
        it('should return 401 without token', async () => {
            const res = await request(app)
                .get('/api/v1/users');
            
            expect(res.status).toBe(401);
        });

        it('should return users with valid token', async () => {
            const res = await request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${validToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
});
```

## Security

### Validación de Input

```javascript
// Siempre validar y sanitizar
const sanitizedInput = {
    name: validator.escape(validator.trim(input.name)),
    email: validator.normalizeEmail(validator.trim(input.email)),
    password: validator.escape(input.password)
};
```

### Rate Limiting

```javascript
// Por defecto: 100 requests / 15 minutos
// Para autenticación: 5 requests / 15 minutos
```

## 📧 Contacto

Issues: https://github.com/alexkore12/nodejs-express-api/issues

---

¡Gracias por contribuir! 🙏
