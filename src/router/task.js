const express = require("express");
const router = express.Router();

const Task = require("../model/task");

// Middlewares
const authMiddleware = require("../middleware/auth");

// Creation Of Task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user._id });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read All Tasks
router.get("/", authMiddleware, async (req, res) => {
  const match = {};
  const sort = {};
  try {
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
      const sortString = req.query.sortBy.split("-");
      sort[sortString[0]] = sortString[1] === "asc" ? 1 : -1;
    }
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    // .execPopulate();

    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Read A Task
router.get("/:id", authMiddleware, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) return res.status(404).send({});
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update A Task
router.patch("/:id", authMiddleware, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedToUpdate = ["description", "completed"];
  const isValid = updates.every((update) => allowedToUpdate.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid Update!" });
  }

  try {
    // const task = await Task.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete A Task
router.delete("/:id", authMiddleware, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
