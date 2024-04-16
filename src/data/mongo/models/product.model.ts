import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type     : String,
    required : [true, 'Name is required'],
    unique   : true,
  },
  
  capacity: {
    type     : Number,
    required : [true, 'Capacity is required'],
  },

  height: {
    type     : Number,
    required : [true, 'Height is required'],
  },

  diameter: {
    type     : Number,
    required : [true, 'Diameter is required'],
  },

  price: {
    type     : Number,
    required : [true, 'Price is required'],
  },
})

export const ProductModel = mongoose.model('Product', productSchema)