const mongoose = require("mongoose");
require("dotenv").config();
const URL_LOCAL = process.env.REMOTE_MONGODB_URL

// console.log(URL_LOCAL);
mongoose.set("strictQuery", true);
mongoose.connect(URL_LOCAL).then(() => console.log('Connected!'));

mongoose.set("runValidators", true);
