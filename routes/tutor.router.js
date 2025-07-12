const express = require("express");
const { getAllTutors } = require("../controllers/tutor.controllers");
const tutorRouter = express.Router();

tutorRouter.get("/", getAllTutors);

module.exports = tutorRouter;
