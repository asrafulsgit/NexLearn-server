const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model');

// register user
const userRegister = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// login user : email and password
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or user not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "10d" }
    );

    res.cookie("nluAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
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
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "10d" }
    );

    res.cookie("nluAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 10,
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid Google token.",
    });
  }
};


// logout user
const userLogout = (req, res) => {
  try {
    res.clearCookie("nluAccessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


// user observer
// const userObserver = async (req, res) => {
//   const {email} = req.user;
//   try {
//    if(!email){
//     return res.status(400).send({
//       message : "Unauth user!",
//       success : false
//     })
//    }
//    const user = await User.findOne({email})
//    return res.status(200).send({
//       user : {name : user?.name,email : user?.email,avatar : user?.avatar},
//       message : "Authenticated user!",
//       success : true
//     })
//   } catch (error) {
//     return res.status(500).send({
//       message: "somthing broke!",
//       success: false,
//     });
//   }
// };




module.exports={
     userRegister,
     userLogin,
     googleLogin,
     userLogout,
     userObserver
}