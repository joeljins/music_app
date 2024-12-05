const express = require("express");
const path = require("path");
const app = express();
const router = require("./routes/router");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(express.static("public"));

app.use("/", router);

// Use the user router for authentication
app.use("/user", userRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
