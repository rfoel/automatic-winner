const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

const fields = require("./fields.json");

app.use(cors());
app.listen(port, () =>
  console.log(`Server listening on port ${port}!`, `http://localhost:${port}`)
);

app.get("/", (req, res) => res.send("Hello there"));
app.get("/fields", (req, res) => res.json(fields));
