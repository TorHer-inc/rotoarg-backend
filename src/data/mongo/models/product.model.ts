import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type     : String,
    required : [true, 'Name is required'],
    unique   : true,
  },
  
  description: {
    type : String,
  },

  price: {
    type    : Number,
    default : 0,
  },

  percentage: {
    type    : Number,
    default : 0,
  },

  total_price: {
    type    : Number,
    default : 0,
  }
})

export const ProductModel = mongoose.model('Product', productSchema)