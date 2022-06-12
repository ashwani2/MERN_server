const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const jwt = require("jsonwebtoken");

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("hello world from router");
});
//Using Promises
// router.post("/register", (req, res) => {

//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "plzz fill the field properly" });
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "plzz use another email" });
//             }
//             const user = new User({ name, email, phone, work, password, cpassword });
//             // above line can be wriiten as given below line
//             //but due to key value pair have same name so we write this intead
//             //const user=new User({name:name,email:email,phone:phone,work:work,password:password,cpassword:cpassword});
//             user.save().then(() => {
//                 res.status(201).json({ message: "user registered succesfully" });
//             }).catch((err) => {
//                 res.status(500).json({ error: "Failed to registered" });
//             });
//         }).catch((err) => { console.log(err); });

// });

//using Async and await
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "plzz fill the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "plzz use another email" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "passwords doesn't match" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      // above line can be wriiten as given below line
      //but due to key value pair have same name so we write this intead
      //const user=new User({name:name,email:email,phone:phone,work:work,password:password,cpassword:cpassword});
      const userRegister = await user.save();

      if (userRegister) {
        res.status(201).json({ message: "user registered succesfully" });
      } else {
        res.status(500).json({ error: "Failed to registered" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();

      res.cookie("jwtToken", token, {
        expires: new Date(Date.now() + 25892000000), //this numbers refers to 30 days
        httpOnly: true, // it allows to run cookies also on http websites
      });

      console.log(userLogin);
      if (!isMatch) {
        res.status(400).json({ error: "Inavaild Credentials" });
      } else {
        res.status(200).json({ message: "userSigned in succesfully" });
      }
    } else {
      res.status(400).json({ error: "Inavaild Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("plzz fill the form");
      return res.json({ error: "plzz fill the contact form" });
    }
    const userContact = await User.findOne({ _id: req.userID });
    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userMessage.save();
      res.status(201).json({ message: "User Contact succesfully added" });
    }
  } catch (error) {
    console.log(error);
  }
});

//Logout Functionality
router.get("/logout", auth, (req, res) => {
  console.log("Logging out the User...");
  res.clearCookie("jwtToken", { path: "/" });
  res.status(200).send("USER LOGOUT");
});

module.exports = router;
