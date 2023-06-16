
const mongoose = require("mongoose")
const User = require("../models/user.model")

const Schema = mongoose.Schema


const replySchema = new Schema ({
    message : {type : String, require : true},
    time : {type: Date ,default : Date.now},
    likes : {type : Number, default: 0},
    likedBy : [],
    image : String,
    createdBy : {type : mongoose.ObjectId, ref : User }

})


module.exports = mongoose.model("Reply", replySchema)