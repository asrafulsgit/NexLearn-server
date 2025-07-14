const express = require('express'); 
const { userRegister, userLogin, googleLogin, userLogout, userObserver } = require('../controllers/user.controllers');

const studentAuthentication = require('../middlewares/studentAuth.middleware');

const userRouter = express.Router();


userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.post('/google/login', googleLogin)
userRouter.get('/logout',studentAuthentication , userLogout)
userRouter.get('/observer',studentAuthentication, userObserver)

 


module.exports = userRouter;