const jwt = require('jsonwebtoken');

const adminAuthentication = async(req,res,next)=>{
     const {nluAccessToken} =req.cookies;
     try {
          if (!nluAccessToken) {
            return res.status(401).send({
                success: false,
                message: 'Access denied. No token provided.',
            });
          }
          const verifytoken =  jwt.verify(nluAccessToken, process.env.JWT_ACCESS_TOEKN)
        
          if(verifytoken.role !== 'admin'){
               return res.status(400).send({
                    success : false,
                    message : 'unauthorize user!'
               })
          }
          req.admin = verifytoken;
          next();
     } catch (error) {
          return res.status(500).send({
            success: false,
            message: 'Invalid or expired token. Please login again.',
            });
     }
}

module.exports = adminAuthentication ;

