const express = require("express");
const app = express();
const dotenv = require("dotenv");
const routes = require("./src/routes");

dotenv.config();

const port = process.env.PORT || 8000;

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
