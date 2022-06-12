const dotenv = require('dotenv')
const express = require('express');

const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
dotenv.config({ path: './config.env' });
require("./db/conn");

app.use(express.json());

// const User = require("./model/userSchema");
app.use(require("./router/auth"));
const PORT = process.env.PORT;





// app.get("/", (req, res) => {
//     res.send("hello world from the server");
// });

// app.get("/about", middleware, (req, res) => {
//     res.send("hello world");
// });

// app.get("/contact", (req, res) => {
//     res.send("hello world");
// });

// app.get("/signup", (req, res) => {
//     res.send("signup");
// });

// app.get("/signin", (req, res) => {
//     res.send("signin");
// });

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})