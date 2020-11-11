const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const Post = require('./models/Post')
const { MONGODB } = require('./config');

//schema 
const typeDefs = gql`
    type Post{
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }

    
    type Query {
        getPosts: [Post]
    }
`
//processing logic 
const resolvers = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find();
                return posts;
            } catch(err){
                throw new Error(err);
            }
        } 
    }
}

//create server instance
const server = new ApolloServer({
    typeDefs,
    resolvers
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

    


