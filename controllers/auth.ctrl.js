const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user.model");
const { upload } = require("../config/multer.config"); //multer upload for image upload

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", upload.single('profilePicture'), async (req, res) => {
  try {
    const user = new User({
        ...req.body, 
        profilePicture: `uploads/${req.file.filename}`
    
    });

    //TODO: Allow user to register and upload image
    await user.save();
    res.redirect("/user/login");
  } catch (e) {
    console.log(e)
    //Catch error
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

/**
 * Handles the login
 */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
  })
);

router.delete("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


module.exports = router;