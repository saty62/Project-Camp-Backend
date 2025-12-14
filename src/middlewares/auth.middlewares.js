import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
//import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, resizeBy, next) =>{
   const token =  req.cookies?.accessToken || req.header("authorization")?.replace("Bearer", "");
   if(!token){
    throw new ApiError(401, "unauthorized request")
   }
   try{
    const decodedToken = jwt.verify(token, process.env.ACESS_TOKEN_SECRET)
    await User.findById(decodedToken?._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry", 
    );
     if(!user){
    throw new ApiError(401, "Invalid access token");
   }
   req.user = user
   next()
   }

   catch(error){
    throw new ApiError(401, "Invalid access token");
   }
})