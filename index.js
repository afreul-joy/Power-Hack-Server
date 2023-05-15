const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000; // You can change the port number if needed

app.use(express.json()); // for handling json data use middleware
app.use(express.urlencoded({ extended: true }));

/*  #################################
         CONNECTING TO MONGODB
    #################################
*/

//--------connecting to database----------
const username = encodeURIComponent(process.env.dbUser); // checking env variable
const password = encodeURIComponent(process.env.dbPass);
//console.log(username, password);
const url = `mongodb+srv://${username}:${password}@cluster0.vljpp.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(url); //
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

//-------------ROOT PAGE ------------
app.get("/", (req, res) => {
  res.send("Server Ok!");
});

//-------------handle bad url request------------
app.use((req, res) => {
  res.send("<h1>Bad Request - 404 - PAGE NOT FOUND </h1>");
});

//-------------Server Listen------------
app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
  await connectDB(); // Connection function called when server is running
});

