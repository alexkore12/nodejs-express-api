# Node.js Express REST API

API RESTful construida con Node.js y Express, lista para producción.

## Características

- **Express.js** - Framework web minimalista
- **Validación** - Joi schema validation
- **Seguridad** - Helmet, CORS configurado
- **Logging** - Morgan para logs de HTTP
- **ESM/CommonJS** - Compatible con ambos
- **TypeScript-ready** - Estructura preparada

## Instalación

```bash
npm install
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Tests
```bash
npm test
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

## Estructura

```
src/
├── index.js          # Entry point
├── routes/
│   └── api.js        # Rutas de API
├── middleware/
│   └── errorHandler.js
└── models/           # Modelos de datos
```

## Configuración

Variables de entorno (`.env`):

```env
PORT=3000
NODE_ENV=development
```

## Seguridad

- Helmet: Headers de seguridad
- CORS: Control de accesos
- Input validation: Joi schemas
- Error handling: Errores controlados sin leakage

## Contributing

1. Fork
2. Create feature branch
3. Commit
4. Push y PR

## License

MIT
