import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";
import { Product } from "../models/products.model.js";
import { Order } from "../models/orders.model.js";
import { OrderItem } from "../models/orderItems.model.js";



const addItemToOrder = asyncHandler(async(req,res)=>{
    try {
        const {orderId,productId,quantity,unitPrice} = req.body
        if (!orderId || !productId || !quantity || !unitPrice) {
            throw new ApiError(400, 'All fields are required');
        }
        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new ApiError(400, 'Invalid ObjectId');
        }
        if (quantity <= 0) {
            throw new ApiError(400, 'Quantity must be greater than 0');
        }
        if (unitPrice <= 0) {
            throw new ApiError(400, 'Unit price must be greater than 0');
        }
        const totalPrice = quantity * unitPrice;
        if(!totalPrice <=0){
            throw new ApiError(400,"Invalid Total Price")
        }
        const orderItem = await OrderItem.create({
            orderId,
            productId,
            quantity,
            unitPrice,
            totalPrice
        })
        if(!order){
            throw new ApiError(404,"Something went wrong while adding items to the order")
        }
        return res 
        .status(200)
        .json(new ApiResponse(200,orderItem,"Successfully added item to order"))
    } catch (error) {
        throw new ApiError(500,error.message || "Something went wrong internally while adding item to the order")
    }

})

const removeItemFromOrder = asyncHandler(async(req,res)=>{
    try {
        const {orderItemId} = req.params
        if(!mongoose.Types.ObjectId,isValid(orderItemId)){
            throw new ApiError(400,"Invalid Object Id")
        }
        const orderItem = await OrderItem.findById(orderItemId)
        if(!orderItem){
            throw new ApiError(400,"Order item doesnt not exists !")
        }
        await orderItem.deleteOne()
        return res 
        .status(200)
        .json(new ApiResponse(200,null,"Successfully deleted the order item"))
    } catch (error) {
        throw new ApiError(400,error.message || "Something went wrong while deleting your order item")
    }
})

const updateOrderItem  = asyncHandler(async(req,res)=>{

        try {
            const orderItemId = req.params
            const {quantity} = req.body
            if(!mongoose.Types.ObjectId,isValid(orderItemId)){
                throw new ApiError(400,"Invalid Object Id")
            }
            const orderItem = await OrderItem.findByIdAndUpdate(orderItemId,{
                $set:{
                    quantity :quantity
                }
            },{new:true})
            if(!orderItem){
                throw new ApiError(400,"Something went wrong while updating order item.")
            }
            return res 
            .status(200)
            .json(new ApiResponse(200,orderItem,"Successfully updated items !"))
        } catch (error) {
            throw new ApiError(500,error.message || "Something went wrong internally while updating your order item")
        }

})

const getOrderItemsByOrderId = asyncHandler(async(req,res)=>{
    const {orderId} = req.params
    if(!mongoose.Types.ObjectId,isValid(orderId)){
        throw new ApiError(400,"Invalid Object Id")
    }
    const orderItem = await OrderItem.find({orderId:orderId})
    if(orderItem.length == 0){
        throw new ApiError(400,"Couldnt find your order item !")
    }
    return res 
    .status(200)
    .json(new ApiResponse(200,orderItem,"Successfully fetched your order item"))
})

const deleteOrderItem = asyncHandler(async(req,res)=>{
    try {
        const orderItemId = req.params
        if(!mongoose.Types.ObjectId,isValid(orderItemId)){
            throw new ApiError(400,"Invalid Object Id")
        }
    
        const orderItem = await OrderItem.findById(orderItemId)
        if(!orderItem){
            throw new ApiError(400,"Order item doesnt exists !")
        }
        await orderItem.deleteOne()
        return res 
        .status(200)
        .json(new ApiResponse(200,null,"Deleted order Item successfully !"))
    } catch (error) {
        throw new ApiError(500,error.message || "Something went wrong while deleting order item")
    }
})


export {addItemToOrder,
    removeItemFromOrder,
    updateOrderItem,
    getOrderItemsByOrderId,
    deleteOrderItem
}