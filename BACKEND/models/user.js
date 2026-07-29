import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 idU : Number ,
 age : Number ,
 lname : String ,
 fname : String ,
 password : String ,
 username : String ,
 role : Role 


}
)

export default mongoose.model("User" , userSchema)