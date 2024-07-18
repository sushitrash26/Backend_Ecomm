import mongoose,{Schema} from "mongoose";

const cartItemSchema = new Schema({
    cartId:{
        type: mongoose.Types.ObjectId,
        ref:"Cart"
    },
    productId:{
        type: mongoose.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type: Number,
        required:true,
        min:[1,"Minimum number of items in the cart should be 1"]
    }
},{timestamps:true})


export const CartItem = mongoose.model("CartItem",cartItemSchema)