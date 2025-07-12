const dotenv = require('dotenv');
dotenv.config();

const server = require('./app');
const mongoConnection = require('./config/DB.config');

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

let httpServer;

mongoConnection().then(() => {
    httpServer = server.listen(PORT, () => {
       console.log('🚀 Server is running on port', PORT);
     });
   }).catch((err) => {
     console.error('❌ Failed to connect to MongoDB:', err);
     process.exit(1)
   });

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  if (httpServer) {
    httpServer.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});    