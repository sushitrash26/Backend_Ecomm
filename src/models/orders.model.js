import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    orderDate:{
        type: Date,
        default:Date.now
    },
    status:{
        type:String,
        enum:["Pending","Completed","Cancelled"],
        default:"Pending"
    },
    totalAmount:{
        type:Number,
        required:true,
        validate: {
            validator: function(v) {
              return v > 0;
            },
            message: 'Quantity must be greater than 0',
          }
    },
    shippingAddressId:{
        type:mongoose.Types.ObjectId,
        ref :"Address",
        required:true
    },
    items:[{
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
              required: true
            },
            quantity: { type: Number, required: true }
          }],
    

},{timestamps:true})

export const Order = mongoose.model("Order",orderSchema)