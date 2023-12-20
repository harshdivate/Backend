import asyncHandler from '../utils/asyncHandler.js'
import { APIError } from '../utils/APIError.js'
import { User } from '../models/user.model.js'
import { uploadFiletoCloudinary } from '../utils/cloudnary.js'

const registerUser = asyncHandler(async (req, res) => {
    // Get details from user
    //validate,
    //check if user already exists :username,email
    //check for images,check for avatar
    // if available upload them to cloudinary,avatar
    // Create user object - create entry in db
    // remove password and refresh token
    // check for user creation
    // return response
    const { fullName, email, username, password } = req.body
    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() === ''
        )
    ) {
        throw new APIError(400, 'All Fields are required')
    }
    const existedUser = User.findOne({
        $or: [{ username }, { email }],
    })
    console.log(existedUser)
    if (existedUser) {
        throw new APIError(409, 'User with email or username already exists')
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.path

    if (!avatarLocalPath) {
        throw new APIError(400, 'Avatar file is required')
    }
    const avatar = await uploadFiletoCloudinary(avatarLocalPath)
    const coverImage = await uploadFiletoCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new APIError(400, 'Avatar file is required')
    }

    User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase(),
    })
})

export { registerUser }
