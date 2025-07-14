const express = require("express");
const adminRouter = express.Router();
const adminAuthentication = require("../middlewares/adminAuth.middleware");
const { getAllUsers, updateUserRole, searchUserByName, filterUsersWithRole } = require("../controllers/admin.controllers");

adminRouter.get("/users", adminAuthentication, getAllUsers);
adminRouter.put("/user/:userId/role", adminAuthentication, updateUserRole);
adminRouter.get("/users/search", adminAuthentication, searchUserByName);
adminRouter.get("/users/filter", adminAuthentication, filterUsersWithRole);

module.exports = adminRouter;
