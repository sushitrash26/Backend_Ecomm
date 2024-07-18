import mongoose,{Schema} from "mongoose";


const paymentSchema = new Schema({
    orderId:{
        type:mongoose.Types.ObjectId,
        ref:"Order"
    },
    paymentType:{
        type: String,
        enum:["Online","COD"],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["Declined","Completed","Pending"],
        default:"Pending"
    },
    transactionId:{
        type:String,
        required:true
    },
    paymentDate:{
        type:Date,
        default:Date.now
    }


},{timestamps:true})

export const Payment = mongoose.model("Payment",paymentSchema)