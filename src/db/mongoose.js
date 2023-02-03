const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const connectDB = mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.log("Failed to connect DB!", err));

module.exports = connectDB;
