import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    idP : Number ,
    name : String ,
    quantity : Number ,
    minQuantity : Number ,
    price : Number ,
    cost : Number ,
    barcode : String ,
    category : Category 

}) ;

export default mongoose.model("Product" , productSchema) ;
