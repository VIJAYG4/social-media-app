const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config');



//create server instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

//connect to MONGODB and start the server - uses express server behind the scenes
mongoose
    .connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log('connected to MONGODB!');
        return server.listen({ port: 5000 });
    })
    .then((res) => {
        console.log(`server running at ${res.url}`)
    })

    


