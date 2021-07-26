const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'})

/**
 * Funcion encargada de conectarse con el servidor de Base de datos
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        console.log('Coneccion Exitosa');
    } catch (error) {
        console.log('Error conectandose con la BD');
        console.log('Error', error);
        process.exit(1); // Codigo que detiene la app
    }
}

module.exports = connectDB;
