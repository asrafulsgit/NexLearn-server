const User = require("../models/user.model");

// get All users (for admin)
const getAllUsers = async (req, res) => {
  
  try {
    const users = await User.find().select("-password");

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// Change a user's role (admin only)
const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  if (!["admin", "tutor", "student"].includes(newRole)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Role must be admin, tutor, or student.",
    });
  }

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = newRole;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${newRole}`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating user role",
    });
  }
};


//  Search users by name (admin only)
const searchUserByName = async (req, res) => {
  const { name } = req.query;

  if (!name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    const users = await User.find({
      name: { $regex: name, $options: "i" }  
    }).select("-password");

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found with that name",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users found",
      users
    });
  } catch (error) {
    console.error("Error searching users by name:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while searching users",
    });
  }
};

// filter user by role (admin only)

const filterUsersWithRole = async(req,res)=>{
  const {role} = req.query; 
  try {
    if(!role){
      return res.status(404).send({ 
      success: false, 
      message: 'User role is required!' 
    });
    }
    const users = await User.find({role})
    return res.status(200).send({ 
      success: true, 
      users,
      message: 'Users filter successfull' 
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Server error while filtering users" });
  }
}



module.exports = {
  getAllUsers,
  updateUserRole,
  searchUserByName,
  filterUsersWithRole
};
