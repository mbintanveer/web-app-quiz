const mongoose = require("mongoose");


const booksSchema = new mongoose.Schema({
  book_name: { type: String, default: null },
  book_title: { type: String, default: null },
});


module.exports = mongoose.model("book", booksSchema);
