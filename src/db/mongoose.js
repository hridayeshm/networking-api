const mongoose = require("mongoose");
const MongoURL =
  "mongodb+srv://Networking:mongoatlas123@cluster0.3ufawdp.mongodb.net/Networking-api?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MongoURL).then(() => {
  console.log("db connected succssfully");
});
