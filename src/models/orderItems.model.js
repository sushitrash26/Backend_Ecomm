import mongoose, { Schema } from "mongoose";

const orderItemsSchema = new Schema(
  {
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: [{
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    }],
    quantity: {
      type: Number,
      required: true,
      min: [1, "Order Items should be atleast 1"],
    },
    unitPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Quantity must be greater than 0",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Quantity must be greater than 0",
      },
    },
  },
  { timestamps: true }
);

export const OrderItem = mongoose.model("OrderItem", orderItemsSchema);
