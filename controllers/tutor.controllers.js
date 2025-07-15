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
      tutors,
    });
  } catch (error) {
    console.error("Error fetching tutors:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching tutors",
    });
  }
};

const searchTutors = async (req, res) => {
  const { name } = req.query;

  if (!name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    const tutors = await User.find({
     role : 'tutor', name : { $regex: name, $options: "i" }  
    });

    // if (!tutors.length) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No sessions found with that name",
    //   });
    // }

    return res.status(200).json({
      success: true,
      message: "tutors found",
      tutors
    });

  } catch (error) {
    console.error("Error searching tutors by name:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while searching tutors",
    });
  }
};

module.exports = {
  getAllTutors,
  searchTutors
};
