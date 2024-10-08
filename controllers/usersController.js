

const User = require("../models/User")
const Note = require("../models/Note")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")

//@desc GET all users
//@route GET /users
//@access Private

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select('-password').lean()

    if (!users?.length) {
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
    const {id, username, roles, active,password} = req.body;

    //confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
        return res.status(400).json({message:"All fields are required"})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({message:"User not found"})
    }

    // check duplicate

    const duplicate = await User.findOne({username}).lean().exec();
    //Allow update to the original user

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message:"Duplicate username"})
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password,10)
    }

    const updatedUser = await user.save()

    res.json({message:`${updatedUser.username} updated`});

})


//@desc Delete a user
//@route DELETE /users
//@access Private

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "User ID Required" });
    }

    // Check for notes associated with the user
    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) { // note will be null if no notes are found
        return res.status(400).json({ message: "User has assigned notes" });
    }

    // Find the user by ID
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" }); // Use 404 for not found
    }

    // Delete the user
    await user.deleteOne();

    const reply = `Username ${user.username} with ID ${user._id} deleted`; // Access user before deletion
    res.json({ reply });
});


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}