import mongoose,{Schema} from "mongoose";

const addressSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    street:{
        type: String,
        required:true

    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        // required:true
    },
    country:{
        type:String,
        // required:true
        default:"India"
    },
    postalCode:{
        type:Number,
        required:true
    },
    addressType:{
        type:String,
        enum:["Billing","Shipping"],
        default:"Shipping"
    }
},{timestamps:true})


export const Address = mongoose.model("Address",addressSchema)