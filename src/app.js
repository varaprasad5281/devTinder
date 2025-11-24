const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("This is Test Page");
});

app.use("/hello", (req, res) => {
  res.send("Hello from the server");
});
app.use("/", (req, res) => {
  res.send("This is Home page of your App");
});

app.listen("9999", () => {
  console.log("Your express app is running in the portal:9999");
});
