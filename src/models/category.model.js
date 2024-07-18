import mongoose,{Schema} from "mongoose";

const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        enum:["Home Decor"],
        default:"Home Decor"
    }
},{timestamps:true})



export const Category = mongoose.model("Category",categorySchema)