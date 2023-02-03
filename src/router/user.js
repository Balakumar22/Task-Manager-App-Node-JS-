const express = require("express");
const router = express.Router();

const User = require("../model/user");

const sharp = require("sharp");

const {
  sendWelcomeEmail,
  sendCancellationEmail,
} = require("../email/accounts");

// Middlewares
const authMiddleware = require("../middleware/auth");

// Creation Of User
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    sendWelcomeEmail(user.email, user.name);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredential(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Logout User
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      ({ token }) => token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Logout All Users
router.post("/logoutall", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// Read All Users
router.get("/me", authMiddleware, async (req, res) => {
  res.send(req.user);
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (err) {
  //   res.status(500).send(err);
  // }
});

// Read A User
router.get("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send({});
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update A User
router.patch("/me", authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedToUpdate = ["name", "email", "password", "age"];
  const isValid = updates.every((update) => allowedToUpdate.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid Update!" });
  }

  try {
    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // const user = await User.findById(id);

    // if (!user) {
    //   return res.status(404).send();
    // }

    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete A User
router.delete("/me", authMiddleware, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(id);

    // if (!user) {
    //   return res.status(404).send();
    // }

    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Upload Avatar

const multer = require("multer");

const uploadAvatar = multer({
  // dest: "avatar",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(
        new Error(
          `Please upload image with extension .jpg (or) .jpeg (or) .png`
        )
      );
    }

    cb(undefined, true);
  },
});

router.post(
  "/me/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/me/avatar", authMiddleware, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

module.exports = router;
