const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const FIREBASE_URL = 'https://stockmaster-61d56-default-rtdb.firebaseio.com/';

// --- ENDPOINTS PARA PRODUCTOS ---

// Obtener todos
app.get('/products', async (req, res) => {
    try {
        const response = await fetch(`${FIREBASE_URL}products.json`);
        const data = await response.json();
        res.json(data || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Guardar nuevo
app.post('/products', async (req, res) => {
    try {
        const response = await fetch(`${FIREBASE_URL}products.json`, {
            method: 'POST',
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await fetch(`${FIREBASE_URL}products/${id}.json`, { method: 'DELETE' });
        res.json({ message: 'Eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ENDPOINTS PARA USUARIOS ---
app.post('/users', async (req, res) => {
    try {
        const response = await fetch(`${FIREBASE_URL}users.json`, {
            method: 'POST',
            body: JSON.stringify(req.body)
        });
        res.status(201).json(await response.json());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const response = await fetch(`${FIREBASE_URL}users.json`);
        res.json(await response.json());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));