import { User } from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      404,
      error.message || "Something went wrong while generating the tokens !"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  

  const { username, email, password, phoneNumber, fullName, isAdmin } = req.body;
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);
  if (
    [username, email, password, fullName].some((item) => item?.trim() === "")
  ) {
    throw new ApiError(404, "All Fields should be valid and present !");
  }
  if (!phoneNumber) {
    throw new ApiError(404, "Phone Number Field should be valid and present !");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }, { phoneNumber }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists !!");
  }

  const localAvatarPath = req.file?.path;
  if (!localAvatarPath) {
    throw new ApiError(404, "Something went wrong while capturing your file");
  }

  const avatar = await uploadOnCloudinary(localAvatarPath);
  if (!avatar) {
    throw new ApiError(
      404,
      "Something went wrong while uploading files to cloudinary"
    );
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    username: username.toLowerCase(),
    email,
    phoneNumber,
    password,
    isAdmin,
  });

  // if(!user){
  //     throw new ApiError(404,"Something went wrong while creating user")
  // }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(404, "Something went wrong while creating user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "Registered User Successfully !"));
});

const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { email, password, phoneNumber, username } = req.body;
  if (!email && !phoneNumber && !username) {
    throw new ApiError(404, "Pass required credentials !");
  }
  if (!password) {
    throw new ApiError(404, "Password is required !");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }, { phoneNumber }],
  });
  if (!user) {
    throw new ApiError(400, "User does not exists !");
  }
  const isPasswordValid = await user.isPasswordTrue(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Credentials !");
  }

  //generating tokens
  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httponly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: refreshToken, accessToken, loggedInUser },
        "Logged In Successfully !"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httponly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out Successfully !"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request !");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Token !");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used.");
    }
    const { accessToken, newRefreshToken } =
      await generateRefreshAndAccessToken(user._id);
    const options = {
      httponly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", accessToken, options)
      .clearCookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, "Access Token Refreshed !"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Error Occured !!!");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(user?._id);
  const passwordCheck = await user.isPasswordTrue(currentPassword);
  if (!passwordCheck) {
    throw new ApiError(200, "Invalid user credentials");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, null, "Password Changed !"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  console.log("api called !")
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Request !");
  }

  const user = await User.findById(req.user._id).select("-password -refreshToken")

  if(!user){
    throw new ApiError(401,"Unauthorized Request ! or user does not exists !")
  }



  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Current User Fetched Successfully")
    );
});

const updateUserDetails = asyncHandler(async (req, res) => {

  console.log(req.body)
  const { fullName } = req.body;
  if(!fullName){
    throw new ApiError(404,"Full Name Is Required")
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully !"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  // console.log(req.file.path)
  console.log(req.file)
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is missing ");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "avatar url doesnt exist !");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Updated Avatar Successfully"));
});

const checkUniqueUsername = asyncHandler(async(req,res)=>{
  const {username} = req.params
  console.log(username)
  const newUsername = username?.trim().toLowerCase()
  const user = await User.findOne({username:newUsername})
  if(user){
    return res.status(200).json(new ApiResponse(400, null, "Username is not unique")) 
  }
  return res.status(200).json(new ApiResponse(200, null, "Username is unique"))
})



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  checkUniqueUsername
};
