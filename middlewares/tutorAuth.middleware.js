const jwt = require('jsonwebtoken');

const tutorAuthentication = async(req,res,next)=>{
     const {nluAccessToken} =req.cookies;
    
     try {
          if (!nluAccessToken) {
            return res.status(401).send({
                success: false,
                message: 'Access denied. No token provided.',
            });
          }
          const verifytoken =  jwt.verify(nluAccessToken, process.env.JWT_ACCESS_TOKEN)
          
          if(verifytoken.role !== 'tutor'){
               return res.status(400).send({
                    success : false,
                    message : 'unauthorize user!'
               })
          }
          req.tutor = verifytoken;
          next();
     } catch (error) {
          return res.status(500).send({
            success: false,
            message: 'Invalid or expired token. Please login again.',
            });
     }
}

module.exports = tutorAuthentication ;

