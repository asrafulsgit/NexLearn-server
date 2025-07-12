const Material = require("../models/material.model");
const Session = require("../models/session.model");

// Create Material (tutor only)
const createMaterial = async (req, res) => {
  const { sessionId } = req.params;
  const tutorId = req.tutor.id;
  try {
    const { title, driveLink, image } = req.body;

    if (!tutorId || !sessionId || !title || !driveLink || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const session = await Session.findOne({
      _id: sessionId,
      tutor: tutorId,
      status: "approved",
    });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Associated session not found",
      });
    }

    const material = new Material({
      session: sessionId,
      tutor: tutorId,
      title,
      driveLink,
      image,
    });

    await material.save();
    return res.status(201).json({
      success: true,
      message: "Material created successfully",
      material,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create material",
      error: error.message,
    });
  }
};

// Get materials created by tutor
const getMyMaterials = async (req, res) => {
  try {
    const tutorId = req.tutor?.id; 
    if (!tutorId) {
      return res.status(404).json({
        success: false,
        message: "tutor id is required",
      });
    }
    const materials = await Material.find({ tutor: tutorId }).populate(
      "session",
      "title"
    );
    return res.status(200).json({
      success: true,
      message: "Materials fatched",
      materials,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch materials",
      error: error.message,
    });
  }
};

// Get all materials (admin only)
const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("tutor", "name email")
      .populate("session", "title");
    return res.status(200).json({
      success: true,
      message: "Materials fatched",
      materials,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all materials",
      error: error.message,
    });
  }
};

// Update material (tutor only)
const updateMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const tutorId = req.tutor?.id;

    if (!tutorId || !materialId) {
      return res.status(404).json({
        success: false,
        message: "tutor and material id are required",
      });
    }
    const { title, driveLink, image } = req.body;

    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }
    if (material.tutor.toString() !== tutorId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this material",
      });
    }

    material.title = title || material.title;
    material.driveLink = driveLink || material.driveLink;
    material.image = image || material.image;

    await material.save();

    return res.status(200).json({
      success: true,
      message: "Material updated",
      material,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update material",
      error: error.message,
    });
  }
};

// Delete material (admin only)
const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    if (!materialId) {
      return res.status(404).json({
        success: false,
        message: "materialId id are required",
      });
    }
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    await material.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete material",
      error: error.message,
    });
  }
};


// get materials by session (student)
const getMaterialsBySession = async (req, res) => {
  
  try {
    const { sessionId } = req.params;
    
     if (!sessionId) {
      return res.status(404).json({
        success: false,
        message: "session id is required",
      });
    }
    const materials = await Material.find({ session: sessionId }).populate('tutor', 'name email');

    if (!materials || materials.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No materials found for this session.',
      });
    }

   return res.status(200).json({
      success: true,
      message : 'materials fatched by session id',
      data: materials,
    });
  } catch (error) {
     
    return  res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

module.exports = {
  createMaterial,
  getMyMaterials,
  getAllMaterials,
  updateMaterial,
  deleteMaterial,
  getMaterialsBySession
};
