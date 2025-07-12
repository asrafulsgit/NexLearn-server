const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model');
const admin = require('../config/firebase.config')
const { isValidPassword } = require('../utilities/password-validator');

// register user
const userRegister = async (req, res) => {
  try {
    const { name,avatar, email, password,cPassword } = req.body;
    if(!name || !email || !password || !cPassword){
       return res.status(400).send({ 
        message: "Please complete required field!",
        success : false
       });
    }
    const isExist = await User.findOne({ email });
    if (isExist) {
    return res.status(400).send({ 
        message: "email is already exist!",
         success : false
       });
    } 
    if(password !== cPassword){
        return res.status(400).send({
        message: "Password is not match!",
        success : false
      });
    }
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
    return res.status(400).send({
        message: passwordValidation.message,
        success : false
      });
    }
    
      const hash = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hash,
        avatar
      });
      await newUser.save();
    return  res.status(201).send({
        success : true, 
        message: "Register completed" 
    });
    
  } catch (error) {
    return  res.status(500).send({
      message: "somthing broke!",
      success : false
    });
  }
};

// login user : email and password
const userLogin = async (req, res) => {
  const { email, password } = req.body;
    try {
      const isExist = await User.findOne({ email });
    if (!isExist) {
      return res.status(404).send({
        message: "Invalid email",
        success : false
      });
    }
     
    const existedUser = await bcrypt.compare(password, isExist.password);
    if (!existedUser) {
      return res.status(401).send({ 
        message: "Wrong password!", 
        success : false
      });
    }
     
    const accessToken = jwt.sign(
      {
        id: isExist._id, email : isExist.email
      },
      process.env.JWT_ACCESS_TOEKN,
      { expiresIn: "1h" }
    );
    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "None",
      maxAge: 1000 * 60 * 60,
    });

    return res.status(200).send({
      message: "Logged in successfully",
      success: true,
      user : {name : isExist?.name,email : isExist?.email,avatar : isExist?.avatar}
    })
    } catch (error) {
        return  res.status(500).send({
            message: "somthing broke!",
            success : false
        });
    }
};

// login user : google
const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decoded;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        avatar: picture,
        google: true,
      });
      await user.save();
    }
    
    const accessToken = jwt.sign(
          {
            id: user._id,  email : user.email
          },
          process.env.JWT_ACCESS_TOEKN,
          { expiresIn: "1h" }
        );
    
        res.cookie("accesstoken", accessToken, {
         httpOnly: true,
        secure: true, 
        sameSite: "None", 
        maxAge: 1000 * 60 * 60
        });
    
        return res.status(200).send({
          message: "Logged in successfully",
          success: true,
          user : {name : user.name || name, email : user.email || email, avatar : user.avatar || picture}
        })
  } catch (err) { 
    return res.status(401).json({ 
        message: "Invalid Google token",
        success : false 
    });
  }

}

// logout user
const userLogout = async (req, res) => {
  try {
    res.clearCookie("accesstoken", {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    });
    
    return res.status(200).send({
      message: "user logout successful",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "somthing broke!",
      success: false,
    });
  }
};

// user observer
const userObserver = async (req, res) => {
  const {email} = req.user;
  try {
   if(!email){
    return res.status(400).send({
      message : "Unauth user!",
      success : false
    })
   }
   const user = await User.findOne({email})
   return res.status(200).send({
      user : {name : user?.name,email : user?.email,avatar : user?.avatar},
      message : "Authenticated user!",
      success : true
    })
  } catch (error) {
    return res.status(500).send({
      message: "somthing broke!",
      success: false,
    });
  }
};




module.exports={
     userRegister,
     userLogin,
     googleLogin,
     userLogout,
     userObserver
}