import mongoose from "mongoose";

interface IProduct extends Document {
  name      : string;
  capacity  : number;
  height    : number;
  diameter  : number;
  price     : number;
  updatedAt : Date;
}

const productSchema = new mongoose.Schema({
  name: {
    type     : String,
    required : [true, 'Name is required'],
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
},
{
  timestamps: true,
}
)

productSchema.set('toJSON', {
  transform: function( doc, ret, options ) {
    const { _id, ...data } = ret;
    return { id: _id, ...data };
  },
  virtuals: true,
  versionKey: false,
})

export const ProductModel = mongoose.model<IProduct>('Product', productSchema);