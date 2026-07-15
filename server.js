const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

console.log("Server Running!");
