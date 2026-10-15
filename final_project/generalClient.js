const axios = require("axios");

const BASE_URL = "http://localhost:5000";


// Retrieve all books
async function getAllBooks() {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log("All books:");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error retrieving books:", error.message);
        throw error;
    }
}


// Retrieve a book by ISBN/database key
async function getBooksByISBN(isbn) {
    try {
        const response = await axios.get(
            `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
        );

        console.log("Book by ISBN:");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error retrieving book:", error.message);
        throw error;
    }
}


// Retrieve books by author
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `${BASE_URL}/author/${encodeURIComponent(author)}`
        );

        console.log("Books by author:");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error retrieving books by author:", error.message);
        throw error;
    }
}


// Retrieve books by title
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `${BASE_URL}/title/${encodeURIComponent(title)}`
        );

        console.log("Books by title:");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error retrieving books by title:", error.message);
        throw error;
    }
}


// Retrieve reviews for a book
async function getBookReview(isbn) {
    try {
        const response = await axios.get(
            `${BASE_URL}/review/${encodeURIComponent(isbn)}`
        );

        console.log("Book reviews:");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error retrieving reviews:", error.message);
        throw error;
    }
}


// Export the functions for reuse
module.exports = {
    getAllBooks,
    getBooksByISBN,
    getBooksByAuthor,
    getBooksByTitle,
    getBookReview
};


// Run a function when this file is executed directly
if (require.main === module) {
    const operation = process.argv[2];
    const value = process.argv.slice(3).join(" ");

    (async () => {
        switch (operation) {
            case "all":
                await getAllBooks();
                break;

            case "isbn":
                await getBooksByISBN(value);
                break;

            case "author":
                await getBooksByAuthor(value);
                break;

            case "title":
                await getBooksByTitle(value);
                break;

            case "review":
                await getBookReview(value);
                break;

            default:
                console.log(
                    "Usage: node generalClient.js " +
                    "[all|isbn <key>|author <name>|title <title>|review <key>]"
                );
        }
    })().catch(() => {
        process.exitCode = 1;
    });
}