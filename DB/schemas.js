const { gql } =  require("apollo-server-core");

// Schema
const typeDefs = gql `
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    type Token {
        token: String 
    }

    input UsuarioInput {
        nombre: String
        apellido: String
        email: String
        password: String
    }

    input AuthInput {
        email: String!
        password: String!
    }

    type Query {
        getUser(token: String!): Usuario
    }
    type Mutation {
        createUser(input: UsuarioInput): Usuario
        authUser(input: AuthInput) : Token
    }

    
`;



module.exports = typeDefs;