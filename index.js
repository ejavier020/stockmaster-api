const express = require('express');
const cors = require('cors');
const https = require('https'); // Usamos el módulo nativo del núcleo de Node.js

const app = express();
app.use(cors());
app.use(express.json());

const FIREBASE_BASE_URL = 'stockmaster-61d56-default-rtdb.firebaseio.com';

// Función auxiliar nativa para consultar a Firebase sin depender de dependencias externas
const firebaseRequest = (path, method = 'GET', bodyData = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: FIREBASE_BASE_URL,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (bodyData) {
            req.write(JSON.stringify(bodyData));
        }
        req.end();
    });
};

// --- ENDPOINTS PARA TU APP ---

// Obtener Productos
app.get('/products', async (req, res) => {
    try {
        const data = await firebaseRequest('/products.json', 'GET');
        if (!data || data === 'null') return res.json([]);
        
        // Mapeamos el objeto de Firebase a Array limpio para tu frontend
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: "Fallo en Firebase", details: err.message });
    }
});

// Guardar Producto
app.post('/products', async (req, res) => {
    try {
        const result = await firebaseRequest('/products.json', 'POST', req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Fallo al guardar", details: err.message });
    }
});

// Eliminar Producto
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await firebaseRequest(`/products/${id}.json`, 'DELETE');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Fallo al eliminar", details: err.message });
    }
});

// Registrar Usuario
app.post('/users', async (req, res) => {
    try {
        const result = await firebaseRequest('/users.json', 'POST', req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Fallo al registrar usuario", details: err.message });
    }
});

// Obtener Usuarios
app.get('/users', async (req, res) => {
    try {
        const data = await firebaseRequest('/users.json', 'GET');
        if (!data || data === 'null') return res.json([]);
        const formattedData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: "Fallo al obtener usuarios", details: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo exitosamente en el puerto asignado por Railway: ${PORT}`);
});