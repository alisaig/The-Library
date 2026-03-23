// Map storing every book, using randomly generated ids as keys
const headings = ["title", "author", "rating", "status", "pages", "date"];
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


function displayBooks() {
    // Store the books container div in a variable, to add children to later
    const booksContainer = document.getElementById("books-container");

    console.log("books size:", books.size);
    console.log("booksContainer:", booksContainer);

    for (const book of books.values()) {
        const bookRow = document.createElement("div");
        bookRow.id = book.id;
        bookRow.classList.add("book-row");

        for (const heading of headings) {
            const bookCell = document.createElement("div");
            bookCell.textContent = book[heading];
            bookRow.appendChild(bookCell)
        };

        booksContainer.appendChild(bookRow);
    };
};

displayBooks();


const statusField = document.querySelector("#status");
const startDateField = document.querySelector("#start-date");
const endDateField = document.querySelector("#end-date");
const ratingFields = document.querySelector(".rating-group");

// Update the form to only show certain fields depending on the value of status

function statusDependentFormUpdate() {
    const currentStatus = statusField.value;

    switch(currentStatus) {
        case "to-read":
            startDateField.disabled = "true";
            endDateField.disabled = "true";
            ratingFields.disabled = "true";
            break;
        case "reading":
            startDateField.disabled = "true";
            endDateField.disabled = "false";
            ratingFields.disabled = "true";
            break;
        case "read":
            startDateField.disabled = "false";
            endDateField.disabled = "false";
            ratingFields.disabled = "false";
            break;
    }
}

statusDependentFormUpdate()

statusField.addEventListener("change", statusDependentFormUpdate);

// Event listener to visually display rating in form when adding a new book
const stars = document.querySelectorAll(".star");

ratingFields.addEventListener("change", (event) => {
    const rating = parseInt(event.target.value);

    // Adds a .filled class to any svg star whose index matches or is lower than the rating
    for (let i = 0; i < stars.length; i++) {
        if (i < rating) {
            stars[i].classList.add("filled");
        } else {
            stars[i].classList.remove("filled");
        }
    }
})