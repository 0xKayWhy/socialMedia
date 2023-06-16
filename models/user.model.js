const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema


const userSchema = new Schema ({
    userName : {type : String, require : true},
    firstName : {type : String, require : true},
    lastName : String,
    birthday : {type : Date , require : true},
    email : {type : String, require : true},
    phoneNo : String,
    address : String,
    profilePicture : String,
    password : {type: String,required: true},
    dateJoin : {type : Date , default : Date.now},
    friends :  Array



})





userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    user.password = bcrypt.hashSync(user.password, 10);
    next();
  });
  
  userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  module.exports = mongoose.model("User", userSchema);