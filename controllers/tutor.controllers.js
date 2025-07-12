const User = require("../models/user.model");

//get All tutors  
const getAllTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: "tutor" }).select("-password");

    if (!tutors || tutors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tutors found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tutors fetched successfully",
      data: tutors,
    });
  } catch (error) {
    console.error("Error fetching tutors:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching tutors",
    });
  }
};

module.exports = {
  getAllTutors
};
