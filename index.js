const express = require('express');
const app = express();
const PORT = 3000;

// Este "traductor" permite que Express entienda el formato JSON en los pedidos
app.use(express.json());

// 1. Tu lista de platos con IDs únicos
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
    { id: 16, nombre: "Cerveza", precio: 3 },
    { id: 17, nombre: "Tabacos", precio: 0.3 },
    { id: 18, nombre: "Porciones extras", precio: 1.5 }
];

// Aquí guardaremos los pedidos acumulados
const pedidos = [];

// 2. Ruta principal de bienvenida (HTML)
app.get('/', (req, res) => {
    res.send('<h1>¡Bienvenido al Sistema POS del Restaurante!</h1><p>Usa la ruta <strong>/menu</strong> para ver los productos disponibles.</p>');
});

// 3. Ruta para ver el Menú en formato JSON
app.get('/menu', (req, res) => {
    res.json(menu);
});

// 4. Ruta para ver todos los pedidos registrados
app.get('/pedidos', (req, res) => {
    res.json(pedidos);
});

// 5. NUEVA RUTA (POST): Recibir un pedido nuevo y calcular el total automáticamente
app.post('/pedidos', (req, res) => {
    const itemsSolicitados = req.body.items; // Ej: [1, 5]
    
    // Si no enviaron platos en el pedido, devolvemos un error
    if (!itemsSolicitados || !Array.isArray(itemsSolicitados) || itemsSolicitados.length === 0) {
        return res.status(400).json({ error: "Debes incluir al menos un plato en tu pedido usando un arreglo de 'items'." });
    }

    let sumaTotal = 0;
    const detallesPlatos = [];

    // Recorremos los IDs enviados para buscar su precio real en el menú
    itemsSolicitados.forEach(idPlato => {
        const platoEncontrado = menu.find(plato => plato.id === idPlato);
        if (platoEncontrado) {
            sumaTotal += platoEncontrado.precio;
            detallesPlatos.push(platoEncontrado.nombre); // Guardamos el nombre para el detalle
        }
    });

    const nuevoPedido = {
        id: pedidos.length + 1,
        items: itemsSolicitados,
        detalle: detallesPlatos,             // Ahora mostramos los nombres de lo que pidieron
        total: parseFloat(sumaTotal.toFixed(2)), // Suma automática redondeada a 2 decimales
        fecha: new Date().toLocaleString()
    };

    pedidos.push(nuevoPedido);

    res.status(201).json({
        mensaje: "¡Pedido registrado con éxito!",
        pedido: nuevoPedido
    });
});

// 6. Encendido del servidor
app.listen(PORT, () => {
    console.log(`=== SERVIDOR ENCENDIDO ===`);
    console.log(`Página principal: http://localhost:${PORT}`);
    console.log(`Ver Menú: http://localhost:${PORT}/menu`);
});