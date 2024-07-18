import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {Address} from "../models/address.model.js"
import mongoose from "mongoose";


const addAddress = asyncHandler(async(req,res)=>{
    const {street, city, state, country, postalCode} = req.body;
    const userId = req.user?._id;
    console.log(userId)
    const newAddress = await Address.create({
            userId,
            street,
            city,
            state,
            country,
            postalCode,
    });
    if(!newAddress){
        throw new ApiError(400,"Something went wrong while saving your address !")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, newAddress, 'Address added successfully'));
  
})

const getAllAddresses = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const addresses = await Address.find({ userId });

    if (!addresses || addresses.length === 0) {
        throw new ApiError(404, 'No addresses found for this user');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, addresses, 'Addresses retrieved successfully'));
})

const getAddressById = asyncHandler(async(req,res)=>{
    const { addressId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400,"Invalid Object Id")
    }
        const address = await Address.findById(addressId);

        if (!address) {
            throw new ApiError(404, 'Address not found');
        }

    return res
    .status(200)
    .json(new ApiResponse(200, address, 'Address retrieved successfully'));
})

const updateAddress= asyncHandler(async(req,res)=>{
    const { addressId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400,"Invalid Object Id")
    }
    const { street, city, state, country, postalCode, addressType } = req.body;

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            { street, city, state, country, postalCode, addressType },
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            throw new ApiError(404, 'Address not found');
        }

        return res
        .status(200)
        .json(new ApiResponse(200, updatedAddress, 'Address updated successfully'));
    
})

const deleteAddress = asyncHandler(async(req,res)=>{
    const { addressId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400,"Invalid Object Id")
    }
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
        throw new ApiError(404, 'Address not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, null, 'Address deleted successfully'));

})

const getUserLastAddress = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    if(!userId){
        throw new ApiError(400,"Unathorized Request")
    }
    const address = await Address.find({ userId }).sort({ createdAt: -1 }).limit(1);
    if(!address){
        throw new ApiError(404,"No address found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, address, 'Address retrieved successfully'));
})

export {addAddress,
        getAllAddresses,
        getAddressById,
        updateAddress,
        deleteAddress,
        getUserLastAddress
}