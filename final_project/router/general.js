const express = require("express");

const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

const public_users = express.Router();

// Promise based helpers (async/await) used by every route below
const getAllBooks = () => Promise.resolve(books);

const getBookByISBN = (isbn) => Promise.resolve(books[isbn]);

const getBooksByAuthor = (author) => Promise.resolve(
    Object.fromEntries(
        Object.entries(books).filter(([id, book]) =>
            book.author.toLowerCase().includes(author.toLowerCase())
        )
    )
);

const getBooksByTitle = (title) => Promise.resolve(
    Object.fromEntries(
        Object.entries(books).filter(([id, book]) =>
            book.title.toLowerCase().includes(title.toLowerCase())
        )
    )
);

const getReviews = (isbn) => Promise.resolve(
    books[isbn] ? books[isbn].reviews || {} : undefined
);

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username,
        password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});


// Get all books
public_users.get("/", async (req, res) => {
    try {
        const allBooks = await getAllBooks();
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books"
        });
    }
});


// Get book by ISBN/key
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve book"
        });
    }
});


// Get books by author
public_users.get("/author/:author", async (req, res) => {
    try {
        const result = await getBooksByAuthor(req.params.author);

        if (Object.keys(result).length === 0) {
            return res.status(404).json({
                message: "No books found for this author"
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to search books"
        });
    }
});


// Get books by title
public_users.get("/title/:title", async (req, res) => {
    try {
        const result = await getBooksByTitle(req.params.title);

        if (Object.keys(result).length === 0) {
            return res.status(404).json({
                message: "No books found for this title"
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to search books"
        });
    }
});


// Get reviews for a book
public_users.get("/review/:isbn", async (req, res) => {
    try {
        const reviews = await getReviews(req.params.isbn);

        if (reviews === undefined) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve reviews"
        });
    }
});


module.exports.general = public_users;
