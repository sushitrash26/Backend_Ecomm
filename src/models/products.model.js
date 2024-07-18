import mongoose,{Schema} from "mongoose"

const productSchema = new Schema({
    
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref:"Category"
    },
    name :{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    stock:{
        type: Number,
        required:true
    },
    images:[{
        type:String,
        required:true
    }],
    addedBy:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    }

},{timestamps:true})


export const Product = mongoose.model("Product",productSchema)