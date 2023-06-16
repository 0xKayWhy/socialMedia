
const mongoose = require("mongoose")
const User = require("../models/user.model")
const Reply = require("../models/reply.model")

const Schema = mongoose.Schema


const postSchema = new Schema ({
    message : {type : String, require : true},
    time : {type: Date ,default : Date.now},
    reply : {type : mongoose.ObjectId, ref: Reply },
    likes : {type : Number, default: 0},
    likedBy : [],
    image : String,
    createdBy : {type : mongoose.ObjectId, ref : User }

})


module.exports = mongoose.model("Post", postSchema)