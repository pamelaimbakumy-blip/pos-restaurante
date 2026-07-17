// 1. Traemos la herramienta Express que acabamos de instalar
const express = require('express');

// 2. Creamos nuestra aplicación (nuestro servidor)
const app = express();

// 3. Definimos la "puerta" (puerto) por donde escuchará nuestro servidor
const PORT = 3000;

// 4. Le decimos al servidor qué responder cuando alguien entre a la página principal "/"
app.get('/', (req, res) => {
    res.send('<h1>¡Bienvenido al Sistema POS del Restaurante!</h1><p>El servidor está funcionando perfectamente.</p>');
});

// 5. Encendemos el servidor para que empiece a escuchar peticiones
app.listen(PORT, () => {
    console.log(`=== SERVIDOR ENCENDIDO ===`);
    console.log(`Puedes entrar a ver tu sistema en: http://localhost:${PORT}`);
});