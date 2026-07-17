const express = require('express');
const app = express();
const PORT = 3000;
// Este "traductor" permite que Express entienda el formato JSON que le enviemos en los pedidos
app.use(express.json());

// 1. Tu lista de platos con IDs únicos y ordenados
const menu = [
    { id: 1, nombre: "Caldo de gallina", precio: 3.5 },
    { id: 2, nombre: "Parrillada personal", precio: 4 },
    { id: 3, nombre: "Parrillada completa", precio: 6 },
    { id: 4, nombre: "Fritada", precio: 4 },
    { id: 5, nombre: "Trucha", precio: 5 },
    { id: 6, nombre: "Hornado", precio: 5 },
    { id: 7, nombre: "Empanadas", precio: 0.5 },
    { id: 8, nombre: "vaso de jugo", precio: 1 },
    { id: 9, nombre: "jarra de jugo normal", precio: 2 },
    { id: 10, nombre: "jarra de jugo grande", precio: 3.5 },
    { id: 11, nombre: "Cola 1L", precio: 1 },
    { id: 12, nombre: "Cola 2L", precio: 2 },
    { id: 13, nombre: "Cola personal pequeña", precio: 0.5 },
    { id: 14, nombre: "Cheskek", precio: 2 },
    { id: 15, nombre: "Gelatina", precio: 0.5 },
    { id: 16, nombre: "Cerveza", precio: 3.00 },
    { id: 17, nombre: "Tabacos", precio: 0.30 },
    { id: 18, nombre: "Porciones extras", precio: 1.5 }
];
// Aquí guardaremos los pedidos que hagan los clientes
const pedidos = [];

// 2. Ruta principal de bienvenida (HTML)
app.get('/', (req, res) => {
    res.send('<h1>¡Bienvenido al Sistema POS del Restaurante!</h1><p>Usa la ruta <strong>/menu</strong> para ver los productos disponibles.</p>');
});

// 3. Envía la lista de platos en formato JSON
app.get('/menu', (req, res) => {
    res.json(menu);
});
// 3.5 NUEVA RUTA (POST): Recibir un pedido nuevo
app.post('/pedidos', (req, res) => {
    const nuevoPedido = {
        id: pedidos.length + 1,
        items: req.body.items,      // Aquí vendrán los IDs de los platos que pide el cliente
        total: req.body.total,      // El valor total de la cuenta
        fecha: new Date().toLocaleString() // Guardamos la hora exacta del pedido
    };

    // Guardamos el pedido en nuestra lista
    pedidos.push(nuevoPedido);

    // Respondemos con un mensaje de éxito y el pedido creado
    res.status(201).json({
        mensaje: "¡Pedido registrado con éxito!",
        pedido: nuevoPedido
    });
});

// NUEVA RUTA (GET): Ver todos los pedidos acumulados
app.get('/pedidos', (req, res) => {
    res.json(pedidos);
});

// 4. Encendido del servidor
app.listen(PORT, () => {
    console.log(`=== SERVIDOR ENCENDIDO ===`);
    console.log(`Página principal: http://localhost:${PORT}`);
    console.log(`Ver Menú: http://localhost:${PORT}/menu`);
});