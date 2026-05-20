const express = require('express');
const cors = require('cors');

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
        
        // Firebase devuelve un objeto. Si está vacío, respondemos con un array vacío.
        if (!data) return res.json([]);
        
        // Mapeamos aquí en el backend para que a la App Móvil le llegue un Array limpio listo para usar
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        res.json(formattedData);
    } catch (err) {
        res.status(502).json({ error: "Error al leer de Firebase", details: err.message });
    }
});

// Guardar nuevo
app.post('/products', async (req, res) => {
    try {
        const response = await fetch(`${FIREBASE_URL}products.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.status(201).json(result);
    } catch (err) {
        res.status(502).json({ error: "Error al escribir en Firebase", details: err.message });
    }
});

// Eliminar
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await fetch(`${FIREBASE_URL}products/${id}.json`, { method: 'DELETE' });
        res.json({ success: true, message: 'Eliminado correctamente' });
    } catch (err) {
        res.status(502).json({ error: "Error al eliminar en Firebase", details: err.message });
    }
});

// --- ENDPOINTS PARA USUARIOS ---
app.post('/users', async (req, res) => {
    try {
        const response = await fetch(`${FIREBASE_URL}users.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.status(201).json(result);
    } catch (err) {
        res.status(502).json({ error: "Error al registrar usuario", details: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const response = await fetch(`${FIREBASE_URL}users.json`);
        const data = await response.json();
        if (!data) return res.json([]);
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        res.json(formattedData);
    } catch (err) {
        res.status(502).json({ error: "Error al obtener usuarios", details: err.message });
    }
});

// Railway asigna automáticamente el puerto por variable de entorno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));