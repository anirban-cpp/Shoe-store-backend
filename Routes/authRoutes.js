import { Router as expressRouter } from "express";
import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";

const authRouter = expressRouter();

// Login

authRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong Password");

    res.status(200).json({
        _id: user._id,
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

// Register

authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //save user and respond
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(200).json({
        _id: user._id,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update user details

authRouter.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (req.body.password) user.password = req.body.password;
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id
      });
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get User profile

authRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all Users for Admin

authRouter.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        if(users){
            res.status(200).json(users);
        } else {
            res.status(200).json("No users exist");
        }
    } catch(err) {
        res.status(500).json(err);
    }
})

export default authRouter;
