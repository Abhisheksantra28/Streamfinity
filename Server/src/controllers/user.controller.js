import { asyncHander } from "../utils/asycHandler.js";

export const registerUser = asyncHander(async (req,res,next)=>{

    res.status(200).json({
        success:true,
        message:"ok"
    })
})