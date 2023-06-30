const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');
//crea el servidor
const app = express();

dbConnection();

//CORS
app.use(cors());

//directorio publico
app.use( express.static('public') );

//lectura y paseo del body
app.use( express.json())

//rutas
app.use('/api/auth', require('./routes/auth'));
// CRUD EVENTOS
app.use('/api/events', require('./routes/events'));

//escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`server is running in port ${process.env.PORT}`);
} )