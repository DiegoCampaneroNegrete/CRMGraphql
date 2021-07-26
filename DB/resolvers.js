const Usuario = require('../models/Usuarios');
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
        getUser: async (_, {token}) => {
            const userID = await jwt.verify(token, process.env.SECRET_WORD);
            return userID;
        }
    },
    Mutation: {
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
        }

    }
};

module.exports = resolvers;