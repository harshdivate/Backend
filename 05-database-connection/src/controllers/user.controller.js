import asyncHandler from '../utils/asyncHandler.js'
import { APIError } from '../utils/APIError.js'
import { User } from '../models/user.model.js'
import { uploadFiletoCloudinary } from '../utils/cloudnary.js'
import { APIResponse } from '../utils/APIResponse.js'

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
}

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
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    })

    if (existedUser) {
        throw new APIError(409, 'User with email or username already exists')
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath) {
        throw new APIError(400, 'Avatar file is required')
    }

    const avatar = await uploadFiletoCloudinary(avatarLocalPath)
    const coverImage = await uploadFiletoCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new APIError(400, 'Avatar file is required')
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase(),
    })
    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    )
    if (!createdUser) {
        throw new APIError(500, 'Something went wrong while creating user')
    }
    return res
        .status(201)
        .json(new APIResponse(200, createdUser, 'User Registerd Successfully'))
})

const loginUser = asyncHandler(async (req, res) => {
    //To-do
    // Get details from user
    // check if they are not null or undefined
    // check is user exists or not in out db
    // if users exists check is password match with our encrypted password
    // access and refresh token
    // send secured-cookie

    const { username, email, password } = req.body
    if (!(username || email || password)) {
        throw new APIError(400, 'Username or password is required')
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    })
    if (!existedUser) {
        throw new APIError(404, 'User does not exist')
    }
    // Now users exist in our db compare password
    const isPasswordCorrect = await existedUser.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new APIError(401, 'Invalid user credentials')
    }
    // Now  we have to generateAccesstoken and refresh token
    //and send them as cookies and append to the existed user
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
        user._id
    )

    const loggedInUser = await User.findOne(user._id).select(
        '-refreshToken -password'
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new APIResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                'user logged in successfully'
            )
        )
})

export { registerUser, loginUser }
