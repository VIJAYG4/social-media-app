const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const User = require('../../models/User');
const checkAuth = require('../../utils/check-auth');

module.exports = {
    Mutation: {
      createComment: async (_, { postId, body }, context) => {
        const { username } = checkAuth(context);
        if (body.trim() === '') {
          throw new UserInputError('Empty comment', {
            errors: {
              body: 'Comment body must not empty'
            }
          });
        }
  
        const post = await Post.findById(postId);
  
        if (post) {
          post.comments.unshift({
            body,
            username,
            createdAt: new Date().toISOString()
          });
          await post.save();
          return post;
        } else throw new UserInputError('Post not found');
      },

      async deleteComment(_, { postId, commentId}, context){
        const { username } = checkAuth(context);

        const post = await Post.findById(postId);
        if(post){
          const commentIndex = post.comments.findIndex((c) => c.id === commentId); // commentIndex is the array index of that comment in comments array
          // only owner of comment can delete the comment
          if (post.comments[commentIndex].username === username){
            //delete comment
            post.comments.splice(commentIndex, 1)
            await post.save();
            return post;
          }else throw new AuthenticationError("Action not allowed");
        }else throw new UserInputError("post doesn't exist");
      }
     
    }
}