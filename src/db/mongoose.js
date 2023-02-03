const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// const connectDB = mongoose
//   .connect(process.env.DB_CONNECTION_STRING, {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log("Connected Successfully"))
//   .catch((err) => console.log("Failed to connect DB!", err));

module.exports = connectDB;
