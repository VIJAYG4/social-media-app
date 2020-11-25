const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        //get post by postid
        async getPost(_, {postId} ){
            try {
                const post = await Post.findById(postId);
                if(!post){
                    throw new Error("post doens't exist");
                }
                else{
                    return post;
                }
            } catch (err) {
                throw new Error(err);
            }
          
        },
        
        //get all posts
        async getPosts(){
            try{
                const posts = await Post.find().sort({ createdAt : -1}); //sort posts by descending order(-1) or new posts come at the top
                return posts;
            } catch(err){
                throw new Error(err);
            }
        } 
    },

    Mutation: {
        async createPost(_, { body }, context) {
          const user = checkAuth(context);
    
          if (body.trim() === '') {
            throw new Error('Post body must not be empty');
          }
    
          const newPost = new Post({
            body,
            user: user.id,
            username: user.username,
            createdAt: new Date().toISOString()
          });
    
          const post = await newPost.save();
    
        //   context.pubsub.publish('NEW_POST', {
        //     newPost: post
        //   });
    
          return post;
        },

        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
            
            try{
                const post = await Post.findById(postId);
                if (user.username === post.username){
                    await post.delete();
                    return 'post deleted successfully'
                }else{
                    throw new AuthenticationError("Action not allowed");
                }
            }catch(err){
                throw new Error(err);
            }
        }
    }
}