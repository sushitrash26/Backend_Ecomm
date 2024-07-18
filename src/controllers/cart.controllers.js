import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import {Product} from "../models/products.model.js";

const createCart = asyncHandler(async(req,res)=>{
   console.log("cart api called")
   const userId = req.user?._id;
   const {items} = req.body;
   console.log(items)
   const user = await User.findById(userId);
   if(!user){
    throw new ApiError(400,"User not found")
   }    

   for (let item of items){
    const product = await Product.findById(item.productId);
    if(!product){
        throw new ApiError(400,"Product not found")
    }
    if(item.quantity > product.stock){
        throw new ApiError(400,"Product quantity is not available")
    }
    if(product.price != item.price){
        throw new ApiError(400,"Product price is not matching")
    }
   }
   const createdCart = await Cart.create({
        userId,
        items,
    });
    await createdCart.save()
    return res 
    .status(200)
    .json(new ApiResponse(200,createdCart,"Cart created successfully !"))

})

const getCart = asyncHandler(async(req,res)=>{
    const {cartId} = req.params;
    const cart = await Cart.findById(cartId).populate('items.productId')
    if(!cart){
        throw new ApiError(400,"Cart hasnt been created for the user")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Cart retrieved successfully'));
})

const deleteCart = asyncHandler(async(req,res)=>{
        const {cartId} = req.params;
        const cart = await Cart.findById(cartId);

        if (!cart) {
            throw new ApiError(404, 'Cart not found');
        }
        await cart.deleteOne()

        return res
        .status(200)
        .json(new ApiResponse(200, null, 'Cart deleted successfully'));
})

const fetchLatestCart = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const cart = await Cart.find({userId}).sort({createdAt:-1}).limit(1).populate("items.productId")
    console.log(cart)
    if(!cart){
        throw new ApiError(404,"Cart not found")
    }

    

    return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Cart retrieved successfully'));

})

const refreshCart = asyncHandler(async(req,res)=>{
    try {
        console.log("refresh cart api called")
        const userId= req.user?._id;
        if(!userId){    
            throw new ApiError(400,"Unauthorized Request")
        }
        const result = await Cart.deleteMany({ userId: userId });
        if(result.deletedCount===0){
            throw new ApiError(400,"Cart not found")
        }
        return res
        .status(200)
        .json(new ApiResponse(200, null, 'Carts refreshed successfully!'));
    } catch (error) {
        throw new ApiError(400,error.message||"something went wrong while refreshing carts")
    }
    

})

export {createCart,
        getCart,
        deleteCart,
        fetchLatestCart,
        refreshCart
}