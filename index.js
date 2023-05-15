const express = require("express");
require("dotenv").config();
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
const dbName = "BillingDBMS"; // Database name
const url = `mongodb+srv://${username}:${password}@cluster0.vljpp.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

//--------create billing schema / STRUCTURE/ SHAPE----------
const billingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//------------create billing model or collection/table--------------
const BillingDB = mongoose.model("Billing", billingSchema);

/*  #################################
                CREATE 
    #################################
*/
// POST: /api/add-billing -> Create a new billing entry
app.post("/api/add-billing", async (req, res) => {
  try {
    // Create a new billing document
    const newBilling = new BillingDB({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      amount: req.body.amount,
    });

    // Save the new billing document to the database
    const product = await newBilling.save();
    if (product) {
      res.status(200).send({
        success: true, // ***response extra information
        message: "Return a single product",
        data: product,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

/*  #################################
               READ
    #################################
*/
// GET: /products -> Return all the products
app.get("/api/billing-list", async (req, res) => {
  try {
    const product = await BillingDB.find();
    if (product) {
      res.status(200).send({
        success: true, // ***response extra information
        message: "Return all the product",
        data: product,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});


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
