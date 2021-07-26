const {ApolloServer, gql} = require('apollo-server');
const typeDefs = require('./DB/schemas')
const resolvers = require('./DB/resolvers');
const connectDB = require('./config/db');

// Conectar a la BD
connectDB();

// Servidor Apollo
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        const myContext = 'Hola';
        return {
            myContext
        };
    }
});

// Arrancando el servidor
server.listen().then((url) => {
    // console.log(`Servirod listo en la URL ${url}`);
    console.log(`Servirod listo en la URL`, url);
});

