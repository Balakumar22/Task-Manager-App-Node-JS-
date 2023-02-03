const express = require("express");
require("./db/mongoose");

// Routes
const userRouter = require("./router/user");
const taskRouter = require("./router/task");
const Task = require("./model/task");
const User = require("./model/user");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on port ${port}`));

//USER
app.use("/user", userRouter);

// Task
app.use("/task", taskRouter);

// const main = async () => {
//   // const task = await Task.findById("63d960e957d1e6f7350fb25c");
//   // await task.populate("owner");

//   // console.log(task.owner);
//   const user = await User.findById("63d960c957d1e6f7350fb256");
//   await user.populate("tasks");
//   console.log(user.tasks);
// };

// main();
