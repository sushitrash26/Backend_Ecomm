import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // if (name !== "Men" || name !== "Women" || name !== "Others") {
  //   throw new ApiError(404, "Invalid Category");
  // }
  const existingCategory = await Category.findOne({name:name})
  if(existingCategory){
    throw new ApiError(400,"Category already exists !")
  }

  const createdCat = await Category.create({
    name: name,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, createdCat, "Category Created Successfully"));
});
const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(404, "Invalid category Id");
  }
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(200, "Unable to fetch mentioned category.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Fetched category successfully !"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  if (name !== "Men" && name !== "Women" && name !== "Others") {
    throw new ApiError(400, "Invalid Category");
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category Id");
  }
  const updatedCat = await Category.findByIdAndUpdate(
    categoryId,
    { name: name },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedCat, "Updated Category Successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(404, "Invalid category Id");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category Does not exists !");
  }
  category.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category Deleted Succesfully"));
});

export { createCategory, getCategoryById, updateCategory, deleteCategory };
