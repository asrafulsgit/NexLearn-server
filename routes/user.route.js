const express = require('express'); 
const { userRegister, userLogin, googleLogin, userLogout, userObserver } = require('../controllers/user.controllers');
const userAuthentication = require('../middlewares/userAuth-middleware');

const userRouter = express.Router();


userRouter.post('/user/register', userRegister)
userRouter.post('/user/login', userLogin)
userRouter.post('/google/login', googleLogin)
userRouter.get('/user/logout',userAuthentication, userLogout)
userRouter.get('/user/observer',userAuthentication, userObserver)

 


module.exports = userRouter;