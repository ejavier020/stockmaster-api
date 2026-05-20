const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Configuración de CORS y JSON
app.use(cors());
app.use(express.json());

// URL base de tu Realtime Database de Firebase (con el .json final administrado dinámicamente)
const FIREBASE_URL = 'https://stockmaster-61d56-default-rtdb.firebaseio.com';

// --- ENDPOINTS ---

// 1. Obtener Usuarios
app.get('/users', async (req, res) => {
    try {
        const response = await axios.get(`${FIREBASE_URL}/users.json`);
        const data = response.data;
        if (!data || data === 'null') return res.json([]);
        
        // Formatear de Objeto Firebase a Array para tu React Native
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        res.json(formattedData);
    } catch (err) {
        console.error("Error en GET /users:", err.message);
        res.status(500).json({ error: "Error al obtener usuarios de Firebase", details: err.message });
    }
});

// 2. Registrar Usuario
app.post('/users', async (req, res) => {
    try {
        const response = await axios.post(`${FIREBASE_URL}/users.json`, req.body);
        res.status(201).json(response.data);
    } catch (err) {
        console.error("Error en POST /users:", err.message);
        res.status(500).json({ error: "Error al guardar usuario en Firebase", details: err.message });
    }
});

// 3. Obtener Productos
app.get('/products', async (req, res) => {
    try {
        const response = await axios.get(`${FIREBASE_URL}/products.json`);
        const data = response.data;
        if (!data || data === 'null') return res.json([]);
        
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        res.json(formattedData);
    } catch (err) {
        console.error("Error en GET /products:", err.message);
        res.status(500).json({ error: "Error al obtener productos", details: err.message });
    }
});

// 4. Guardar Producto
app.post('/products', async (req, res) => {
    try {
        const response = await axios.post(`${FIREBASE_URL}/products.json`, req.body);
        res.status(201).json(response.data);
    } catch (err) {
        console.error("Error en POST /products:", err.message);
        res.status(500).json({ error: "Error al guardar producto", details: err.message });
    }
});

// 5. Eliminar Producto
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await axios.delete(`${FIREBASE_URL}/products/${id}.json`);
        res.json({ success: true, message: "Eliminado correctamente" });
    } catch (err) {
        console.error("Error en DELETE /products:", err.message);
        res.status(500).json({ error: "Error al eliminar producto", details: err.message });
    }
});

// --- CONFIGURACIÓN DE RED OBLIGATORIA PARA RAILWAY ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto asignado: ${PORT}`);
});