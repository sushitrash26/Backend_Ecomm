import mongoose,{Schema} from "mongoose";

const cartSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            productId:{
                type: mongoose.Types.ObjectId,
                ref:"Product",
                required: true
            },
            quantity: {
                type: Number,
                required:true,
                default: 1,
            }
        }
    ]
},{timestamps:true})

export const Cart = mongoose.model("Cart",cartSchema)