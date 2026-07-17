const express = require('express');
const app = express();
const PORT = 3000;

// Este "traductor" permite que Express entienda el formato JSON en los pedidos
app.use(express.json());

// 1. Tu lista de platos con IDs únicos y un stock inicial limitado
const menu = [
    { id: 1, nombre: "Caldo de gallina", precio: 3.5, stock: 15 },
    { id: 2, nombre: "Parrillada personal", precio: 4, stock: 22 },
    { id: 3, nombre: "Parrillada completa", precio: 6, stock: 22 },
    { id: 4, nombre: "Fritada", precio: 4, stock: 12 },
    { id: 5, nombre: "Trucha", precio: 5, stock: 15 },
    { id: 6, nombre: "Hornado", precio: 5, stock: 15 },
    { id: 7, nombre: "Empanadas", precio: 0.5, stock: 50 },
    { id: 8, nombre: "vaso de jugo", precio: 1, stock: 10 },
    { id: 9, nombre: "jarra de jugo normal", precio: 2, stock: 4 },
    { id: 10, nombre: "jarra de jugo grande", precio: 3.5, stock: 3 },
    { id: 11, nombre: "Cola 1L", precio: 1, stock: 20 },
    { id: 12, nombre: "Cola 2L", precio: 2, stock: 10 },
    { id: 13, nombre: "Cola personal pequeña", precio: 0.5, stock: 15 },
    { id: 14, nombre: "Cheskek", precio: 2, stock: 12 },
    { id: 15, nombre: "Gelatina", precio: 0.5, stock: 25 },
    { id: 16, nombre: "Cerveza", precio: 3, stock: 24 },
    { id: 17, nombre: "Tabacos", precio: 0.3, stock: 30 },
    { id: 18, nombre: "Porciones extras", precio: 1.5, stock: 15 }
];

// Aquí guardaremos los pedidos acumulados
const pedidos = [];

// 2. Ruta principal de bienvenida (HTML)
app.get('/', (req, res) => {
    res.send('<h1>¡Bienvenido al Sistema POS del Restaurante!</h1><p>Usa la ruta <strong>/menu</strong> para ver los productos disponibles y su stock.</p>');
});

// 3. Ruta para ver el Menú en formato JSON (ahora muestra el stock)
app.get('/menu', (req, res) => {
    res.json(menu);
});

// 4. Ruta para ver todos los pedidos registrados
app.get('/pedidos', (req, res) => {
    res.json(pedidos);
});

// 5. NUEVA RUTA (POST): Recibir un pedido nuevo, verificar y restar stock automáticamente
app.post('/pedidos', (req, res) => {
    const itemsSolicitados = req.body.items; // Ej: [1, 5]
    
    if (!itemsSolicitados || !Array.isArray(itemsSolicitados) || itemsSolicitados.length === 0) {
        return res.status(400).json({ error: "Debes incluir al menos un plato en tu pedido usando un arreglo de 'items'." });
    }

    // A. VALIDACIÓN PREVIA: Verificar si hay suficiente stock para todos los productos solicitados
    const conteoItems = {};
    itemsSolicitados.forEach(id => {
        conteoItems[id] = (conteoItems[id] || 0) + 1;
    });

    for (const idPlato in conteoItems) {
        const plato = menu.find(p => p.id === parseInt(idPlato));
        if (!plato) {
            return res.status(404).json({ error: `El producto con ID ${idPlato} no existe en el menú.` });
        }
        if (plato.stock < conteoItems[idPlato]) {
            return res.status(400).json({ 
                error: `Stock insuficiente para '${plato.nombre}'. Solicitado: ${conteoItems[idPlato]}, Disponible: ${plato.stock}` 
            });
        }
    }

    // B. PROCESAMIENTO: Si todo está en orden, restamos del stock y calculamos totales
    let sumaTotal = 0;
    const detallesPlatos = [];

    itemsSolicitados.forEach(idPlato => {
        const platoEncontrado = menu.find(plato => plato.id === idPlato);
        if (platoEncontrado) {
            platoEncontrado.stock -= 1; // Restamos 1 unidad del stock
            sumaTotal += platoEncontrado.precio;
            detallesPlatos.push(platoEncontrado.nombre);
        }
    });

    const nuevoPedido = {
        id: pedidos.length + 1,
        items: itemsSolicitados,
        detalle: detallesPlatos,
        total: parseFloat(sumaTotal.toFixed(2)),
        fecha: new Date().toLocaleString()
    };

    pedidos.push(nuevoPedido);

    res.status(201).json({
        mensaje: "¡Pedido registrado y stock actualizado con éxito!",
        pedido: nuevoPedido
    });
});

// 5.5 RUTA (DELETE): Cancelar un pedido y DEVOLVER el stock correspondiente
app.delete('/pedidos/:id', (req, res) => {
    const idPedido = parseInt(req.params.id);
    const posicion = pedidos.findIndex(p => p.id === idPedido);

    if (posicion === -1) {
        return res.status(404).json({ 
            error: `No se encontró ningún pedido activo con el ID ${idPedido}.` 
        });
    }

    // Sacamos el pedido de la lista
    const [pedidoCancelado] = pedidos.splice(posicion, 1);

    // Devolvemos las unidades de este pedido al inventario/stock
    pedidoCancelado.items.forEach(idPlato => {
        const platoEncontrado = menu.find(plato => plato.id === idPlato);
        if (platoEncontrado) {
            platoEncontrado.stock += 1; // Devolvemos 1 unidad al stock
        }
    });

    res.json({
        mensaje: `¡El pedido #${idPedido} ha sido cancelado y los productos se devolvieron al stock!`,
        pedido: pedidoCancelado
    });
});

// 6. Encendido del servidor
app.listen(PORT, () => {
    console.log(`=== SERVIDOR ENCENDIDO ===`);
    console.log(`Página principal: http://localhost:${PORT}`);
    console.log(`Ver Menú: http://localhost:${PORT}/menu`);
});