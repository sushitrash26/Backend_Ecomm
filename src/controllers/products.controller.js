import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { Product } from "../models/products.model.js";

const createProduct = asyncHandler(async (req, res) => {
  const addedBy = req.user?._id
  if(!addedBy){
    throw new ApiError(404,"UnAuthorized request !")
  }
  const { categoryName, name, stock, price, description } = req.body;
  const category = await Category.findOne({ name: categoryName });
  if (!category) {
    throw new ApiError(404, "Category does not exists !");
  }
  const categoryId = category?._id;
  if ([name, description].some((item) => item.trim() == "")) {
    throw new ApiError(200, "Name and Description should not be empty");
  }
  if (!stock > 0) {
    throw new ApiError("Stock should be positive");
  }
  if (!price > 0) {
    throw new ApiError("Price should be positive");
  }
  /* const {productLocalPath}= req.files?.path */

  let productLocalPaths = [];
  console.log('req.files:', req.files);

  if (
    req.files &&
    Array.isArray(req.files) &&
    req.files.length > 0
  ) {
    productLocalPaths = req.files.map((file) => file.path);
  }

  if (productLocalPaths.length === 0) {
    throw new ApiError(404, "Images are required !");
  }

  const imageUploadPromises = productLocalPaths.map((path) =>
    uploadOnCloudinary(path)
  );
  const imageResults = await Promise.all(imageUploadPromises);
  const imageUrls = imageResults.map((result) => result.url);

  if (imageUrls.length === 0) {
    throw new ApiError(500, "Couldn't upload images");
  }
  const createdProduct = await Product.create({
    categoryId,
    name,
    description,
    images: imageUrls,
    price,
    stock,
    addedBy
  });
  return res
    .status(200)
    .json(new ApiResponse(200, createdProduct, "Created Product Successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(404, "Invalid product id");
    }
    const product = await Product.findById(productId).populate({path:"addedBy",select:"username"});
    if (!product) {
      throw new ApiError(404, "Product does not exists in the database");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product Fetched Successfully !!"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching the product");
  }
});

const getProductByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(404, "Invalid category Id");
  }
  const products = await Product.find({ categoryId: categoryId });
  if (products.length === 0) {
    throw new ApiError(404, "No products with such category");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid Object Id");
    }
    const { name, description, price, stock } = req.body;
    if ([name, description].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "Fields should not be empty !");
    }
    const numericPrice = parseFloat(price);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      throw new ApiError(400, "Price is must!");
    }

    if (!stock || stock <= 0) {
      throw new ApiError(400, "Stock is must !");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          name,
          description,
          numericPrice,
          stock,
        },
      },
      { new: true }
    );
    if (!updatedProduct) {
      throw new ApiError(
        400,
        "Something went wrong while updating product's details"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error.message ||
        "Something went wrong in the server while updating products"
    );
  }
});

const updateProductImages = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid Product Id");
    }
    let newImagesLocalPath = [];
    if (
      req.files &&
      Array.isArray(req.files.images) &&
      req.files.images.length > 0
    ) {
      newImagesLocalPath = req.files.images.map((file) => file.path);
    }
    if (newImagesLocalPath.length === 0) {
      throw new ApiError(404, "Images are required !");
    }
    const newImageUploadPromises = newImagesLocalPath.map((path) =>
      uploadOnCloudinary(path)
    );
    const newImageResults = await Promise.all(newImageUploadPromises);
    const newImageUrls = newImageResults.map((result) => result.url);
    if (!newImageUrls) {
      throw new ApiError(400, "Couldnt upload images to cloudinary");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          images: newImageUrls,
        },
      },
      { new: true }
    );
    if (!updatedProduct) {
      throw new ApiError(
        400,
        "Something went wrong while updating images of your product"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedProduct,
          "Successfully updated images of your product !"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while updating pictures of your products"
    );
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid Product Id");
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(400, "Product Does not Exists !");
    }
    await product.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product Deleted Successfully "));
  } catch (error) {
    throw new ApiError(400, "Something Went Wrong while deleting this product");
  }
});

const getAllProducts = asyncHandler(async(req,res)=>{
      try {
        const products = await Product.find({});
        if(!products){
          throw new ApiError(404,"Could not find products")
        }
        // {
        //   products.map((product)=>(
        //     console.log(product._id)
        //   ))
        // }
        return res 
        .status(200)
        .json(new ApiResponse(200,products,"Products fetched successfully !"))
      } catch (error) {
        throw new ApiError(404,error.message || "Something went wrong while fetching all products ")
      }
})

const getAllProductsWithPagination = asyncHandler(async(req,res)=>{
  try {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const page = parseInt(req.query.page) || 0;
    console.log(page,itemsPerPage)
    const products = await Product.find({}).skip(page * itemsPerPage).limit(itemsPerPage)
    if(!products){
      throw new ApiError(404,"Could not find products")
    }
    return res 
    .status(200)
    .json(new ApiResponse(200,products,"Products fetched successfully !"))
  } catch (error) {
    throw new ApiError(404,error.message || "Something went wrong while fetching all products ")
  }
})


export {
  createProduct,
  getProductById,
  getProductByCategory,
  updateProductDetails,
  updateProductImages,
  deleteProduct,
  getAllProducts,
  getAllProductsWithPagination
};
