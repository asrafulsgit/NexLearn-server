const mongoose = require('mongoose'); 

const mongoConnection = () => {
   return  mongoose.connect(process.env.MONGO_DB_URL,{
     serverSelectionTimeoutMS: 10000,
   })  
.then((res)=>{
     console.log('✅ DB is connected')
}).catch((err)=>{
      console.log('❌ DB connection failed:', err)
      throw err;
})
}

module.exports = mongoConnection;