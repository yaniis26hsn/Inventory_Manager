import mongoose from "mongoose"

const ProvideSchema = new mongoose.Schema({
    idProvide : Number ,
    total : Number ,
    created_at : {type : timestamp  }
})