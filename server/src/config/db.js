const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const uri = "mongodb+srv://canon2:IOloman21@canon2.5wly2.mongodb.net/?retryWrites=true&w=majority&appName=Canon2";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Send a ping to confirm a successful connection
    await mongoose.connection.db.command({ ping: 1 });
    console.log("MongoDB connection established successfully.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;