const express = require('express');
const router = express.Router();
const Joi = require('joi');

// Base de datos en memoria (simulada)
const items = new Map();

// Schema de validación
const itemSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().optional(),
  category: Joi.string().optional()
});

// GET /api/items - Listar todos
router.get('/items', (req, res) => {
  const allItems = Array.from(items.values());
  res.json({
    success: true,
    count: allItems.length,
    data: allItems
  });
});

// GET /api/items/:id - Obtener uno
router.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.get(id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }
  
  res.json({ success: true, data: item });
});

// POST /api/items - Crear
router.post('/items', async (req, res) => {
  try {
    const { error, value } = itemSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details 
      });
    }
    
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const item = { id, ...value, createdAt: new Date().toISOString() };
    
    items.set(id, item);
    
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// PUT /api/items/:id - Actualizar
router.put('/items/:id', (req, res) => {
  const { id } = req.params;
  
  if (!items.has(id)) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }
  
  const { error, value } = itemSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error: 'Validation error',
      details: error.details 
    });
  }
  
  const updatedItem = { 
    ...items.get(id), 
    ...value, 
    updatedAt: new Date().toISOString() 
  };
  
  items.set(id, updatedItem);
  
  res.json({ success: true, data: updatedItem });
});

// DELETE /api/items/:id - Eliminar
router.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  
  if (!items.has(id)) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }
  
  items.delete(id);
  
  res.json({ success: true, message: 'Item eliminado' });
});

module.exports = router;
