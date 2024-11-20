const express = require("express");
const connection = require("./config/connection");
const userRoute = require("./routes/user");
const widgets = require("./routes/widgets");
const feeders = require("./routes/feeders");
var cors = require("cors");


const app = express();

const api = process.env.API_URL;


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(`${api}/user`, userRoute);
app.use(`${api}/widgets`, widgets);
app.use(`${api}/feeders`, feeders);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));