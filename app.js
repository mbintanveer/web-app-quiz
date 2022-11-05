require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./model/user");
const Book = require("./model/book");
const auth = require("./middleware/auth");
const book = require("./model/book");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.post("/profile", async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  try {
    await verifyToken(token);
    console.log("ok");
  } catch (e) {
    res.status(403);
  }
});

app.post("/addBook", async (req, res) => {
  try {
  
    const { book_name, book_title } = req.body;
    
    const book = new Book({
      book_name: req.body.book_name,
      book_title: req.body.book_title
  })
  

  } catch (err) {
    console.log(err);
  }
});

//GET BOOKS
app.get("/getBooks", async (req, res) => {
  try{
    const book = await Book.find();
    res.json(book)
}
  catch(error){
      res.status(500).json({message: error.message})
  }
});



//Search Books
app.get('/getBook/:id', async (req, res) => {
  try{

    var response = [];
    response = await Book.find({book_title: req.params.id});
    res.json(response);
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})



app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});




module.exports = app;


