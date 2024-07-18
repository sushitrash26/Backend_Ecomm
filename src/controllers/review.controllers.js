import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";
import { Product } from "../models/products.model.js";
import { Order } from "../models/orders.model.js";
import { OrderItem } from "../models/orderItems.model.js";
import { Review } from "../models/reviews.model.js";

const addReview = asyncHandler(async(req,res)=>{
        const userId = req.user?._id
        const {productId} = req.params
        const {comment,rating} = req.body
        if(!mongoose.Types.ObjectId.isValid(productId)){
            throw new ApiError(400,"Invalid Object Id")
        }
        if(comment.trim()===""){
            throw new ApiError(400,"Please enter a valid comment !")
        }
        if(!rating || rating > 5){
            throw new ApiError(400,"Please enter a valid rating")
        }
        const review = await Review.create({
            userId,
            productId,
            comment,
            rating
        })
        const populatedReview = await review.populate({path:"userId",select:"-password -refreshToken -email -phoneNumber"})
        if(!review){
            throw new ApiError(400,"Something went wrong while creating your review !")
        }
        return res 
        .status(200)
        .json(new ApiResponse(200,populatedReview,"Successfully Added your review !"))
})

const getReviewById = asyncHandler(async(req,res)=>{
    const {reviewId} = req.params
    console.log(reviewId)
    if(!mongoose.Types.ObjectId.isValid(reviewId)){
        throw new ApiError(400,"Invalid Object Id")
    }
    const review = await Review.findById(reviewId)
    if(!review){
        throw new ApiError(400,"Unable to find your review")
    }
    return res 
    .status(200)
    .json(new ApiResponse(200,review,"Fetched your review successfully"))
})

const getAllReviewsOnProduct = asyncHandler(async(req,res)=>{
    const {productId}= req.params
    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(400,"Invalid Object Id")
    }
    const reviews = await Review.find({productId:productId})
    if(reviews.length == 0){
        throw new ApiError(400,"No reviews for the given product Id")
    }
    return res 
    .status(200)
    .json(new ApiResponse(200,reviews,"Fetched reviews successfully"))
    
})

const updateReview = asyncHandler(async(req,res)=>{
        const {reviewId} = req.params


        if(!mongoose.Types.ObjectId.isValid(reviewId)){
            throw new ApiError(400,"Invalid Object Id")
        }


        const {comment,rating} = req.body

        if(comment.trim()===""){
            throw new ApiError(400,"Please enter a valid comment !")
        }

        if(!rating || rating > 5){
            throw new ApiError(400,"Please enter a valid rating")
        }
        const updatedReview = await Review.findByIdAndUpdate(reviewId,{
            $set:{
                comment:comment,
                addedAt : Date.now(),
                rating:rating
            }
        },{new:true})

        return res 
        .status(200)
        .json(new ApiResponse(200,updatedReview,"Updated review successfully !"))
})

const deleteReview = asyncHandler(async(req,res)=>{
    const {reviewId} = req.params
    if(!mongoose.Types.ObjectId.isValid(reviewId)){
        throw new ApiError(400,"Invalid Object Id")
    }
    const review = await Review.findById(reviewId)
    if(!review){
        throw new ApiError(400,"Review does not exists !")
    }
    await review.deleteOne()
    return res 
    .status(200)
    .json(new ApiResponse(200,null,"Deleted review successfully !"))
})





export {addReview,
    getReviewById,
    getAllReviewsOnProduct,
    updateReview,
    deleteReview
}