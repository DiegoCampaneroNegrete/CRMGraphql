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

    type Producto {
        id: ID
        nombre: String
        precio: Float
        existencia: Int
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

    input ProductoInput {
        nombre: String!
        existencia: Int!
        precio: Float!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    type Query {
        getUser(token: String!): Usuario
    }
    type Mutation {
        # Ususarios
        createUser(input: UsuarioInput): Usuario
        authUser(input: AuthInput) : Token
        # Productos
        createProduct(input: ProductoInput): Producto
    }

    
`;



module.exports = typeDefs;