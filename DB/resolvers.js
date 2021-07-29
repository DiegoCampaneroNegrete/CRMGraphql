const Usuario = require('../models/Usuarios');
const Producto = require('../models/Productos');
const Cliente = require('../models/Cliente');
const bcryptjs = require('bcryptjs');
require('dotenv').config({path: 'variables.env'});
const jwt = require('jsonwebtoken');

// Fucntions

/**
 * 
 * @param {any} userObject 
 * @param {string} secretWord 
 * @param {string} expiresIn 
 */
const createToken = (userObject, secretWord, expiresIn) => {
    const {id, nombre, apellido, email } = userObject;
    const tokenRespone = jwt.sign({ id, nombre, apellido, email }, secretWord, { expiresIn});
    return tokenRespone;
};

// Resolvers
const resolvers = {
    Query: {
        // Ususarios
        getUser: async (_, {token}) => {
            const userID = await jwt.verify(token, process.env.SECRET_WORD);
            return userID;
        },
        // Productos
        getProducts: async () => {
            try {
                const products = Producto.find({});
                return products;
            } catch (error) {
                console.log('Error getProducts =>', error);
            }
        },
        getProduct: async (_, {id}) => {
            const product = await Producto.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product
        },
        getClients: async () => {
            try {
                const clientes = await Cliente.find({});
                return clientes     
            } catch (error) {
                console.log('Error Query getClients', error);
            }
        },
        getClientByVendor: async (_, {}, ctx) => {
            try {
                const id = ctx.user.id;
                console.log('getClientByVendor Id', id);
                const clientes = await Cliente.find({vendedor: id});
                return clientes     
            } catch (error) {
                console.log('Error Query getClientByVendor', error);
            }
        },
        getClient: async (_, {id}, ctx) => {
            // Verificar si existe el cliente
            const client = await Cliente.findById(id);
            if (!client) {
                throw new Error('Cliente no encontrado');
            }

            // Quien lo Creo puede verlo
            if (client.vendedor.toString() !== ctx.user.id) {
                throw new Error('No cuentas con las credenciales del cliente')
            }

            return client;
        }
    },
    Mutation: {
        //  USUSARIOS
        createUser: async (_, {input}) => {
            const {email, password} = input;
            const userExist = await Usuario.findOne({email});
            if (userExist) {
                throw new Error('El Usuario ya existe')
            }

            // Hasheando Password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);
            
            try {
                const usuario = new Usuario(input);
                usuario.save();
                return usuario;
            } catch (error) {
                console.log('Error creando al usuario', error);
            }

        },
        authUser: async (_, {input}) => {
            const {email, password} = input;
            // Verifica que el usuario exista
            const userExist = await Usuario.findOne({email});

            if (!userExist) {
                throw new Error('Usuario NO Existe');
            }
        
            // Revisa que la contraseña sea correcta;
            const correctPassword = await bcryptjs.compare(password, userExist.password);
            console.log('correctPassword', correctPassword);
            if (!correctPassword) {
                throw new Error('Contraseña Incorrecta');
            }

            return { token: createToken(userExist, process.env.SECRET_WORD, '24h') };
        },
        // PRODUCTOS
        createProduct: async (_, {input}) => {
            try {
                // almacenar en base de datos 
                const producto = new Producto(input)
                const response = await producto.save();
                
                return response;
            } catch (error) {
                console.log('Error Creando el Producto', error);
                // throw new Error('Error Creando el Producto', error);
            }
            // const {}

        },
        updateProduct: async (_, {id, input}) => {
            
            let product = await Producto.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            // guardando en la BD
            product = await Producto.findOneAndUpdate({_id: id}, input, {new: true} );
            
            return product;
        },
        deleteProduct: async (_, {id}) => {
            const product = await Producto.findById(id);
            if (!product) {
                throw new Error('Producto No Encontrado')
            }
            // Eliminar Producto
            await Producto.findOneAndDelete({_id: id});
            return 'Producto Eliminado';
        },
        // Cliente:
        createCliente: async (_, {input}, ctx) => {
            console.log('Context', ctx);
            // return null;
            const {email} = input;
            // Verificando si el cliente esta asignado:
            const cliente = await Cliente.findOne({email});

            if (cliente) {
                throw new Error('Cliente ya creado con correo');
            }
            // Creando Instancia
            const newClient = new Cliente(input);
            newClient.vendedor = ctx.user.id;
            // Asignar el vendedor

            // Guardarlo en la BD
            try {
                
                // console.log('newClient ***', newClient);

                const response = await newClient.save()
                return response;    
            } catch (error) {
                console.log('CreateClient() => Error =>', error);
            }
        },
        updateCliente: async (_, {id, input}, ctx) => {
            // Verificar si existe el cliente
            const client = await Cliente.findById(id);
            
            if (!client) {
                throw new Error('Cliente no existe');
            }            

            // Verificar si edita el usuario
            
            if (client.vendedor.toString() !== ctx.user.id) {
                throw new Error('No cuentas con las credenciales del cliente')
            }

            // Guardar cambiso de cliente
            const response = await Cliente.findOneAndUpdate({_id: id}, input, {new: true});
            return response;
        },
        deleteCliente: async (_, {id}, ctx) => {
            // Verificar si existe el cliente
            const client = await Cliente.findById(id);
            
            if (!client) {
                throw new Error('Cliente no existe');
            }            

            // Verificar si edita el usuario
            
            if (client.vendedor.toString() !== ctx.user.id) {
                throw new Error('No cuentas con las credenciales del cliente')
            }

            // Guardar cambiso de cliente
            const response = await Cliente.findOneAndDelete({_id: id});
            return "Cliente Eliminado";

        }
    }
};

module.exports = resolvers;