const express = require("express");
const adminRouter = express.Router();
const adminAuthentication = require("../middlewares/adminAuth.middleware");
const { getAllUsers, updateUserRole } = require("../controllers/admin.controllers");

adminRouter.get("/users", adminAuthentication, getAllUsers);
adminRouter.patch("/user/:userId/role", adminAuthentication, updateUserRole);

module.exports = adminRouter;
