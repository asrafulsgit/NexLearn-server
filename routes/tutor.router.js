const express = require("express");
const { getAllTutors, searchTutors } = require("../controllers/tutor.controllers");
const tutorRouter = express.Router();

tutorRouter.get("/", getAllTutors);
tutorRouter.get("/search", searchTutors);

module.exports = tutorRouter;
