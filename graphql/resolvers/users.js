const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput,
        validateLoginInput
      } = require('../../utils/validators');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        "put in your secret key",
        {expiresIn: '1h'}
    );
}

module.exports = {
    Mutation : {

        async login(_, { username,password }){
           const { errors, valid } = validateLoginInput(username,password);
           
           if(!valid) {
               throw new UserInputError('Errors', { errors });
           }

           const user = await User.findOne({ username });

           if(!user){
               errors.general = "User not found";
               throw new UserInputError("User not found", { errors });
           }

           const match = await bcrypt.compare(password,user.password);
           if(!match){
               errors.general = "wrong credentials";
               throw new UserInputError("wrong credentials", { errors });
           }

           //if the code reaches here, login input is valid - so generate token and return user object
           const token = generateToken(user);

           return {
               ...user._doc,
               id: user._id,
               token
           };
        },

        async register(
            _, 
            {
                registerInput: {username, email, password, confirmPassword}
            }, //curly brace for destructuring or accessing each arg separately
            ){
            //TODO: validate user data
            
            //TODO: ensure user name doens't already exist
            const user = await User.findOne({ username });
            if(user){                                // user null if username doesn't exist otherwise true 
                throw new UserInputError("username is taken", {
                    errors: {                                     //errrors object is payload displayed in frontend
                        username: "this username is taken"
                    }
                })
            }

            //TODO: hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString
            });
            

            const res = await newUser.save(); //save to db

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}