const express = require('express');
const tutorAuthentication = require('../middlewares/tutorAuth.middleware');
const { createMaterial, getMyMaterials, getAllMaterials, deleteMaterial, getMaterialsBySession, updateMaterial } = require('../controllers/material.controllers');
const adminAuthentication = require('../middlewares/adminAuth.middleware');
const studentAuthentication = require('../middlewares/studentAuth.middleware');

const materialRouter = express.Router();

// -------------------- TUTOR ROUTES --------------------
// create material 
materialRouter.post('/tutor',tutorAuthentication,  createMaterial);
// update material who is created
materialRouter.put('/tutor/:materialId', tutorAuthentication, updateMaterial);
// get all materials who is created 
materialRouter.get('/tutor',tutorAuthentication, getMyMaterials);


// -------------------- ADMIN ROUTES --------------------
// get all materials
materialRouter.get('/admin', adminAuthentication , getAllMaterials);
// delete material
materialRouter.delete('/admin/:materialId', adminAuthentication, deleteMaterial);

// -------------------- STUDENT ROUTES --------------------
// get materials by session
materialRouter.get('/student/:sessionId', studentAuthentication, getMaterialsBySession);

module.exports = materialRouter;
