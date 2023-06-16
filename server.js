const express = require("express");
const server = express();
const mongoose = require("mongoose");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("./config/passport.config");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override")

const postCtrl = require("./controllers/post.ctrl")
const authCtrl = require("./controllers/auth.ctrl.js")

server.use(express.static("public"));
server.use(expressLayout);
server.use(express.urlencoded({extended : true}));
server.set("view engine", "ejs");
server.use(methodOverride("_method"));



require("dotenv").config()

const PORT = process.env.PORT

server.use(
    session({
      secret: process.env.SECRET,
      saveUninitialized: true,
      resave: false,
      cookie: { maxAge: 360000 },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB, //Store session in mongodb to preview re-login on server reload
      }),
    })
  );
  //-- passport initialization
  server.use(passport.initialize());
  server.use(passport.session());

  
  server.use(function (request, response, next) {
    // before every route, attach the flash messages and current user to res.locals
    response.locals.currentUser = request.user; //Makes logged in user accessibile in ejs as currentUser.
    response.locals.currentBody = request.body;
    next();
  });

  server.use(postCtrl);
  server.use("/user", authCtrl);

mongoose.connect(process.env.MONGO_DB).then(() => {
    console.log("Connect to MongoDB");
})

server.get("/", (req,res) => {
    res.render("main")


})


server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})