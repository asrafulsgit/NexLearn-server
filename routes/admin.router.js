const express = require("express");
const adminRouter = express.Router();
const adminAuthentication = require("../middlewares/adminAuth.middleware");
const { getAllUsers, updateUserRole, searchUserByName } = require("../controllers/admin.controllers");

adminRouter.get("/users", adminAuthentication, getAllUsers);
adminRouter.put("/user/:userId/role", adminAuthentication, updateUserRole);
adminRouter.get("/users/search", adminAuthentication, searchUserByName);

module.exports = adminRouter;
