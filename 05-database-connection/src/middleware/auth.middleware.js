import { APIError } from '../utils/APIError.js'
import asyncHandler from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer', '')

        if (!accessToken) {
            throw new APIError(401, 'Unauthorized Request')
        }

        const isUserVerified = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        )

        if (!isUserVerified) {
            throw new APIError(401, 'Invalid Access Token')
        }
        //if user is verified then get the details of that user

        const userDetails = await User.findById(isUserVerified?._id).select(
            '-password -refreshToken'
        )

        if (!userDetails) {
            throw new APIError('401', 'Invalid Access Token')
        }
        req.user = userDetails
        next()
    } catch (error) {
        throw new APIError(401, 'Invalid Access Token')
    }
})
