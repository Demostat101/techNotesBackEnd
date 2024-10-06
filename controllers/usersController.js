

const User = require("../models/User")
const Note = require("../models/Note")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")

//@desc GET all users
//@route GET /users
//@access Private

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select('-password').lean()

    if (!users) {
        return res.status(400).json({message:"No users found"})
    }

    res.json(users)
    
})


//@desc create new user
//@route POST /users
//@access Private

const createNewUser = asyncHandler(async(req,res)=>{

    const {username,password,roles} = req.body

    //confirm data

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message:'All fields are required'})
    }

    //Duplicate username handler

    const duplicate = await User.findOne({username}).lean().exec()

    if (duplicate) {
        return res.status(409).json({message:"Duplicate username"})
    }

    // Hash password

    const hashPassword = await bcrypt.hash(password,10) //salt rounds:The number of alphaNumeric character to be added to be add to the password for security reason

    const userObject = {username, password:hashPassword,roles}

    const user = await User.create(userObject)

    if (user) {
        res.status(200).json({message: `New user ${username} created successfully!`})
    } else {
        res.status(400).json({message:"Invalid user data received"})
    }

})


//@desc Update a user
//@route PATCH /users
//@access Private

const updateUser = asyncHandler(async(req,res)=>{

})


//@desc Delete a user
//@route DELETE /users
//@access Private

const deleteUser = asyncHandler(async(req,res)=>{

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}