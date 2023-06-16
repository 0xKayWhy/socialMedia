const router = require("express").Router();
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Reply = require("../models/reply.model");
const secureUser = require("../config/securepage.config");

// const TimeAgo = require('javascript-time-ago');
// const en = require('javascript-time-ago/locale/en')
// TimeAgo.addDefaultLocale(en)
// const timeAgo = new TimeAgo('en-US');


router.get("/",secureUser,  async (req,res) => {
    try {
        const post = await Post.find().populate(["createdBy","reply"])
        const user = await User.find()
        res.render("main", {posts : post , user : user})
    }catch (e) {
        console.log(e)
    }
})

router.post("/",secureUser, async (req,res) => {
    try {

        const posts = new Post ({
            ...req.body,
            createdBy : req.user.id,

        })  
        await posts.save()
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                message : posts.id,
            }
        })
        res.redirect("/")
    }catch(e) {
        console.log(e)
    }
})

router.get("/profile", secureUser, async (req,res) => {
    try {
        const user = await User.find()
        const posts = await Post.find({createdBy : req.user.id}).populate("createdBy")
        res.render("profile", ({posts : posts, user : user}))
    }catch(e) {
        console.log(e)
    }


})

router.delete("/:id/main",secureUser, async (req,res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.redirect("/")
    }catch(e) {
        console.log(e)
    }
})

router.delete("/:id/profile",secureUser, async (req,res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.redirect("/profile")
    }catch(e) {
        console.log(e)
    }
})


router.put("/:id/main/edit",secureUser, async (req,res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            message : req.body.message,
            time : Date.now()
        })
        res.redirect("/")
    } catch(e) {
        console.log(e)
    }
})

router.put("/:id/profile/edit",secureUser, async (req,res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {message : req.body.message})
        res.redirect("/profile")
    } catch(e) {
        console.log(e)
    }
})

router.put("/:id/main/likes",secureUser, async (req,res) => {
    try {
        const likes = await Post.findById (req.params.id)
        let liked = false
        likes.likedBy.forEach((user) => {
            
            if(user == req.user.id) {
                liked = true
                return

            }       
        })
        if(!liked) {
            await Post.findByIdAndUpdate(req.params.id, {
               likes: likes.likes +1 ,
               $push : {likedBy : req.user.id}
           })
       }else{
            await Post.findByIdAndUpdate(req.params.id, {
               likes: likes.likes - 1 ,
               $pull : {likedBy : req.user.id}
           })
       }   

        res.redirect('/')
    }catch(e){
        console.log(e)
    }
})

router.put("/:id/profile/likes",secureUser, async (req,res) => {
    try {
        const likes = await Post.findById (req.params.id)
        let liked = false
        likes.likedBy.forEach((user) => {
            
            if(user == req.user.id) {
                liked = true
                return

            }       
        })
        if(!liked) {
            await Post.findByIdAndUpdate(req.params.id, {
               likes: likes.likes +1 ,
               $push : {likedBy : req.user.id}
           })
       }else{
            await Post.findByIdAndUpdate(req.params.id, {
               likes: likes.likes - 1 ,
               $pull : {likedBy : req.user.id}
           })
       }   

        res.redirect('/profile')
    }catch(e){
        console.log(e)
    }
})

router.put("/:id/main/reply",secureUser, async (req,res) => {
    try {
        const comment = new Reply({
            ...req.body,
            createdBy : req.user.id
        })
        await comment.save();
        await Post.findByIdAndUpdate(req.params.id, {
               $push : {reply : comment}

       }) 

        res.redirect('/')
    }catch(e){
        console.log(e)
    }
})

router.get("/user", secureUser, async (req,res) => {
    try{
        const users = await User.find()
        res.render("user", {users : users})


    }catch(e) {
        console.log(e)
    }
})

router.post("/user/follow/:id", secureUser, async (req,res) => {
    try {
        console.log(req.user.id)
        const follow = await User.findById(req.params.id)
        await User.findByIdAndUpdate(req.user.id,{
            friends : follow._id}
        )
        res.redirect(`back`)
    }catch(e){
        console.log(e)
    }
})

module.exports = router