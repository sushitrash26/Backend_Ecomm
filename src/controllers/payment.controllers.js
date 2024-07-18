import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Payment } from "../models/payments.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentType, transactionId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order id");
  }

  const newPayment = await Payment.create({
    orderId,
    paymentType,
    transactionId,
  });
  if (newPayment) {
    throw new ApiError(400, "Something went wrong while creating your payment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newPayment, "Payment created successfully"));
});

const getPaymentById = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, "Invalid payment id");
  }
  const payment = await Payment.findById(paymentId).populate("orderId");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment retrieved successfully"));
});

const getPaymentsForOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if(!mongoose.Types.ObjectId.isValid(orderId)){
    throw new ApiError(400,"Invalid Object Id")
  }
  const payments = await Payment.find({ orderId }).populate("orderId");

  if (!payments || payments.length === 0) {
    throw new ApiError(404, "No payments found for this order");
  }

return res
    .status(200)
    .json(new ApiResponse(200, payments, "Payments retrieved successfully"));
});

const updatePaymentStatus = asyncHandler(async(req,res)=>{
    const { paymentId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(paymentId)){
        throw new ApiError(400,"Inavlid Object Id")
    }
    const { paymentStatus } = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(
            paymentId,
            { paymentStatus },
            { new: true, runValidators: true }
        );

        if (!updatedPayment) {
            throw new ApiError(404, 'Payment not found');
        }

       return res
       .status(200)
       .json(new ApiResponse(200, updatedPayment, 'Payment status updated successfully'));

})



export { createPayment, getPaymentById,getPaymentsForOrder,updatePaymentStatus };
