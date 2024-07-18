import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import { CartItem } from "../models/cartItems.model.js";


const addItemToCart = asyncHandler(async(req,res)=>{
    const { cartId, productId} = req.params
    const {quantity}  = req.body;
    console.log(quantity)
    // quantity = parseInt(quantity, 10)

    const parsedQuantity = parseInt(quantity, 10);


    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new ApiError(400, 'Invalid quantity');
    }

        const existingItem = await CartItem.findOne({ cartId, productId });
        if (existingItem) {
            throw new ApiError(400, 'Item already exists in cart');
        }

        const cartItem = await CartItem.create({ cartId, productId, quantity: parsedQuantity });
        const populatedCartItem = await cartItem.populate({path:"productId", select:"images[0] name price "})

        return res
        .status(201)
        .json(new ApiResponse(201, cartItem, 'Item added to cart successfully'));

})

const updateItemQuantity = asyncHandler(async(req,res)=>{
        const {cartItemId} = req.params;
        const {quantity} = req.body;
        console.log(quantity)
        const parsedQuantity = parseInt(quantity,10)
        console.log(parsedQuantity)

        if(isNaN(parsedQuantity) || parsedQuantity <= 0) {
            throw new ApiError(400, 'Invalid quantity');
        }

        const cartItem = await CartItem.findByIdAndUpdate(cartItemId, 
            {$set: { quantity: parsedQuantity }}
            , { new: true });

        if (!cartItem) {
            throw new ApiError(404, 'Item not found in cart');
        }

        return res
        .status(200)
        .json(new ApiResponse(200, cartItem, 'Item quantity updated successfully'));

})

const removeItemFromCart = asyncHandler(async(req,res)=>{
    const { cartItemId } = req.params;

    const cartItem = await CartItem.findByIdAndDelete(cartItemId);

    if (!cartItem) {
        throw new ApiError(404, 'Item not found in cart');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, null, 'Item removed from cart successfully'));

})

const getCartItems = asyncHandler(async(req,res)=>{
    const { cartItemId } = req.params;
        const cartItems = await CartItem.findById(cartItemId)
        console.log(cartItems)
        const populatedCartItems = await cartItems.populate({path:'productId',select:"name price images[0]"});

        if (cartItems.length == 0 ) {
            throw new ApiError(404, 'No items found in cart');
        }

        return res
        .status(200)
        .json(new ApiResponse(200, cartItems, 'Cart items retrieved successfully'));
    
})


export {addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        getCartItems
}