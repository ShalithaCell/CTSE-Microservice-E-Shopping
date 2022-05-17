import { Schema, model, Document } from 'mongoose'

interface IProduct extends Document {
  id: string,
  name: string,
  quantity: number,
  price: number,
  storedLocation: string,
  timestamp: string
};

const productSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  storedLocation: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
});

export default model<IProduct>('products', productSchema);

