const express = require("express");
const app = express();
var cors = require('cors');

app.use(cors());

app.get("/", (req, res) => {
});

app.listen(8080, () => {
    console.log("app listening on port 3000");
});