import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    dateCreated:{type:Number, required:true},
    warranty:{type:Number, required:true},
    price:{type:Number, required:true},
    isAvailable:{type:Boolean, required:true},
    image: {type: String, required: false}
});
const Product = mongoose.model('Product',productSchema);

export default Product;