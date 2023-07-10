const { User } = require("../models/User");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.createAccount = async (req, res, next) => {
  try {
    const { email, password,fullName,phoneNumber} = req.body;
    const userInfoExist = await User.findOne({email});
    // console.log(userInfoExist);
    if (userInfoExist) {
      return res
        .status(400)
        .send({
          message: "Email already exist!",
          success: false
        });
    }
    
    const encryptedPassword = await bcrypt.hash(password, 8);
    const userData = {email, password: encryptedPassword,fullName,phoneNumber,plainPassword:password}
    const newUser = await User.create(userData);
 
    res
      .status(201)
      .send({
        user: newUser,
        message: "Account Created Saved Succesfully !",
        success: true
      });
    await newUser.save();
  } catch (error) {
    return res.status(400).json({ message: error.message ,success:false});
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      res.status(404).json({ message: "User Doestn't Exist. Try Sign Up!",success:false });
      return;
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_TOKEN_SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );
     
      return res.status(200).send({ message: "User Loged in", token,success:true });
    }
    res.status(400).send({ message: "Invalid Credentials" ,success:false});
  } catch (error) {
    return res.status(500).send({ message: error.message,success:false });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(req.user)
    const user = await User.findById(userId).select({password:0,plainPassword:0});

    if (!user) {
      return res.status(404).send({ message: "User not found",success:false });
    }

    return res.status(200).send({ user,message: "User created",success:true});
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    let newUserInfo = req.body;
    const userID = req.params.id;
    const user = await User.findById(userID,{password:0,plainPassword:0});

    if (!user) {
      return res.status(404).send({ message: "User not found.",success:false });
    }
   
    const updatedUser = await User.findOneAndUpdate(
      { _id: userID },
      newUserInfo,
      { new: true }
    );
    return res
      .status(202)
      .send({ user:updatedUser, message: "User Updated Succesfully !" ,success:true});
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error ,success:false});
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const {id} = req.params;
    await User.deleteOne({_id:id});
    return res
      .status(200)
      .send({ message: "Your Account has been Deleted Succesfully !" ,success:true});
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};

exports.getUser = async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id,{password:0,plainPassword:0});
    return res.status(202).send({
      user:getUser? getUser: "User Not Found",
      message: "Success !",
      success: getUser? true:false
    });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message });
    return res.status(404).send({ message: error });
  }
};
exports.getAll = async (req, res) => {
  try {
    const getAll = await User.find({},{password:0,plainPassword:0});
    return res
      .status(202)
      .send({
        totalUsers: getAll.length,
        users: getAll,
        success: getAll?true:false
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message,success:false });
    return res.status(404).send({ message: error ,success:false});
  }
};

exports.logOut = async (req, res) => {
  try {
    req.user = null;
    return res.status(202).send({ message: "Logged Out Successfully." ,success:true});
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message,success:false });
    return res.status(404).send({ message: error,success:false });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password,id} = req.user
    const { oldPassword, newPassword } = req.body
    const isCorrect = await bcrypt.compare(oldPassword, password);
    // console.log(" Is Correct : ", isCorrect,id,password,req.user);

    if (!isCorrect) {
      return res.status(404).send({ message: "Invalid Password Information", success: false });
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 8);
    await User.findOneAndUpdate(
      { _id: id },
      { password:encryptedPassword, plainPassword:newPassword},
      { new: true });
    
    return res
      .status(202)
      .send({
        message: "Password updated successfully",
        success: true
      });
  } catch (error) {
    if (error.message) return res.status(404).send({ message: error.message,success:false });
    return res.status(404).send({ message: error ,success:false});
  }
};