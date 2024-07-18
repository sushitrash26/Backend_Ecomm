import mongoose,{Schema} from "mongoose";

const reviewSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    productId:{
        type: mongoose.Types.ObjectId,
        ref:"Product"
    },
    rating:{
        type:Number,
        min:[1,"rating should be greater than 0"],
        max:[5,"rating shouled not be greater than 5"]
    },
    comment:{
        type: String
    },
    addedAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})


export const Review = mongoose.model("Review", reviewSchema)