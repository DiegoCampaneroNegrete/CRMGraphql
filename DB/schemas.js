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

    type Cliente {
        id: ID
        nombre: String
        apellido: String
        empresa: String
        email: String
        teleforno: String
        vendedor: ID
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

    input ClienteInput {
        nombre: String!
        apellido: String!
        empresa: String!
        email: String!
        teleforno: String
    }

    type Query {
        # Usuarios
        getUser(token: String!): Usuario

        # Productos
        getProducts: [Producto]
        getProduct(id: ID!): Producto

        # Clientes
        getClients: [Cliente]
        getClientByVendor: [Cliente]
        getClient(id: ID!): Cliente
    }
    type Mutation {
        # Ususarios
        createUser(input: UsuarioInput): Usuario
        authUser(input: AuthInput) : Token
        
        # Productos
        createProduct(input: ProductoInput): Producto
        updateProduct(id: ID!, input: ProductoInput) : Producto
        deleteProduct(id: ID!): String

        # Cliente
        createCliente(input: ClienteInput): Cliente
        updateCliente(id: ID!, input: ClienteInput): Cliente
        deleteCliente(id: ID!): String
    }

    
`;



module.exports = typeDefs;