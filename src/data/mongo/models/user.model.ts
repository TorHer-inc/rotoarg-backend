import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },

  name: {
    type: String,
    // required: [ true, 'Name is required' ],
  },

  email: {
    type     : String,
    required : [ true, 'Email is required' ],
    unique   : true,
  },

  emailValidated: {
    type    : Boolean,
    default : false,
  },

  password: {
    type     : String,
    // required : true,
  },

  image: {
    type : String,
  },

  role: {
    type    : [String],
    enum    : ['ADMIN_ROLE', 'USER_ROLE'],
    default : ['USER_ROLE'],
  },
})

userSchema.set('toJSON', {
  transform: function( doc, ret, options ) {
    const { _id, ...data } = ret;
    return { id: _id, ...data };
  },
  virtuals: true,
  versionKey: false,
})

export const UserModel = mongoose.model('User', userSchema)