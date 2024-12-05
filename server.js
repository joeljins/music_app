const express = require("express");
const path = require("path");
const app = express();
const router = require("./routes/router");

app.use(express.json());
app.use(express.static("public"));

app.use("/", router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
