const {ApolloServer, gql} = require('apollo-server');
const jwt = require('jsonwebtoken');
const typeDefs = require('./DB/schemas')
const resolvers = require('./DB/resolvers');
const connectDB = require('./config/db');
require('dotenv').config({path: 'variables.env'})
// Conectar a la BD
connectDB();

// Servidor Apollo
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const user = jwt.verify(token, process.env.SECRET_WORD);
                return {
                    user
                };
            } catch (error) {
                console.log('Context Toke Error', error);
            }
        }
    }
});

// Arrancando el servidor
server.listen().then((url) => {
    // console.log(`Servirod listo en la URL ${url}`);
    // console.log(`Servirod listo en la URL`, url);
});

