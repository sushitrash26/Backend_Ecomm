
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { Product } from "../models/products.model.js";
import { Order } from "../models/orders.model.js";
import { Address } from "../models/address.model.js";
import { Cart } from "../models/cart.model.js";

const createOrder = asyncHandler(async (req, res) => {
  try {
    console.log("createOrder api called", req.body)
    const userId = req.user._id;
    console.log(userId)
    const { totalAmount} =req.body;
    const shippingAddress = await Address.find({userId: userId}).sort({ createdAt: -1 });
    const shippingAddressId = shippingAddress?.[0]._id;
    if(!shippingAddress){
        throw new ApiError(400,"Shipping address not found")
    }
    const absTotalAmount =Math.abs(parseFloat(totalAmount));
    const latestCart = await Cart.find({userId: userId}).sort({ createdAt: -1 }).populate("items.productId").limit(1);
    
    const latestCartItems = latestCart?.[0]?.items;
    console.log(latestCartItems)                    

    const expectedTotalAmount = latestCartItems.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);

    console.log("",expectedTotalAmount)


    if(absTotalAmount!= expectedTotalAmount){
        throw new ApiError(400,"Total amount is not matching")
    }

    if (
      !userId ||
      !totalAmount ||
      !shippingAddressId
    ) {
      throw new ApiError(400, "All fields are required");
    }
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(shippingAddressId)
    ) {
      throw new ApiError(400, "Invalid ObjectId");
    }
    if (totalAmount <= 0) {
      throw new ApiError(400, "Total amount must be greater than 0");
    }
    const order = Order.create({
      userId,
      totalAmount:absTotalAmount,
      shippingAddressId,
      items: latestCartItems,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order created Successfully !"));
  } catch (error) {
    console.log("console error for order", error)
    throw new ApiError(500, "Something went wrong while creating your order");
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const orders = await Order.find({ userId: userId }).populate([{path:"items.productId"},{path:"shippingAddressId"}]);
    if (orders.length == 0) {
      throw new ApiError(400, "Something went wrong while fetching your orders or No orders so far");
    }
    console.log("orders",orders)
    return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
  } catch (error) {
    console.log("getuserorders error",error)
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Order Id is Invalid");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(400, "Didnt find the order based on order id");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params;
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Order Id is Invalid");
  }
  const status = req.body;
  if (!status) {
    throw new ApiError(
      400,
      "Please provide a valid status : 'Pending','Completed','Cancelled' "
    );
  }
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        status: status,
      },
    },
    { new: true }
  );

  if (!updatedOrder) {
    throw new ApiError(400, "Something went wrong while updating your order");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, "order updated successfully !"));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Order Id is Invalid");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(400, "Did not find such order in DB");
  }
  await order.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order Deleted Successfully"));
});

export {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
