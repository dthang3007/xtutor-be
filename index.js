require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connectDB");
const signupRoute = require("./routes/auth.route");

const app = express();
connectDB();
app.use(express.json());

app.use("/api/user", signupRoute);
const port = 3333;
app.listen(port, () => console.log("sever running in " + port));
