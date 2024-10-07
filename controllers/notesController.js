const User = require("../models/User")
const Note = require("../models/Note")
const asyncHandler = require("express-async-handler")


//@desc GET all notes
//@route GET /notes
//@access private

const getAllNotes = asyncHandler(async(req,res)=>{
    const notes = await Note.find().lean()

    if (!notes?.length) {
        return res.status(400).json({message:"No notes found"})
    }

     // Add username to each note before sending the response 


    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)  
})


//@desc create new note
//@route POST /notes
//@access Private

const createNewNote = asyncHandler(async(req,res)=>{

    const {user,title,text} = req.body

    //confirm data

    if (!user || !title  || !text) {
        return res.status(400).json({message:'All fields are required'})
    }


     // Check for duplicate title
     const duplicate = await Note.findOne({ title }).lean().exec()

     if (duplicate) {
         return res.status(409).json({ message: 'Duplicate note title' })
     }

    const noteObject = {user,text,title}

    const note = await Note.create(noteObject)

    if (note) {
        res.status(200).json({message: "New note created successfully!"})
    } else {
        res.status(400).json({message:"Invalid note data received"})
    }

})


//@desc Update a note
//@route PATCH /notes
//@access Private

const updateNote = asyncHandler(async(req,res)=>{
    const {id,user, text, completed,title} = req.body;

    //confirm data
    if (!id || !user || !text || typeof completed !== "boolean" || !title) {
        return res.status(400).json({message:"All fields are required"})
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({message:"Note not found"})
    }

     // Check for duplicate title
     const duplicate = await Note.findOne({ title }).lean().exec()

     // Allow renaming of the original note 
     if (duplicate && duplicate?._id.toString() !== id) {
         return res.status(409).json({ message: 'Duplicate note title' })
     }


    note.user = user
    note.text = text
    note.title = title
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)

})


// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

     await note.deleteOne()

    const reply = `Note '${note.title}' with ID ${note._id} deleted`

    res.json({reply})
})


module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}
