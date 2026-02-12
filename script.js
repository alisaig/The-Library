// Map storing every book, using randomly generated ids as keys
const books = new Map();

// Book object 
function Book(title, author, rating, status, pages, date) {
    this.title = title;
    this.author = author;
    this.rating = rating;
    this.status = status;
    this.pages = pages;
    this.date = date;
    // Generate random id unique to each book
    this.id = crypto.randomUUID();
};

// Function to take book info, create a Book object from it and add it to the books map
function addBookToLibrary(title, author, rating, status, pages, date) {
    const book = new Book(title, author, rating, status, pages, date);
    books.set(book.id, book);
};

// Books added as default to test layout
addBookToLibrary("Pride and Prejudice", "Jane Austen", 4, "read", 400, "14 Feb 2016");

addBookToLibrary("Of Mice and Men", "John Steinbeck", 3.5, "read", 107, "4 Nov 2014");

console.log(books);
