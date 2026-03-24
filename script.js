// Map storing every book, using randomly generated ids as keys
const headings = ["title", "author", "pages", "status", "startDate", "endDate", "rating"];
const books = new Map();

// Book object 
function Book(title, author, pages, status, startDate, endDate, rating) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.rating = rating;
    // Generate random id unique to each book
    this.id = crypto.randomUUID();
};

// Function to take book info, create a Book object from it and add it to the books map
function addBookToLibrary(title, author, pages, status, startDate, endDate, rating) {
    const book = new Book(title, author, pages, status, startDate, endDate, rating);
    books.set(book.id, book);
};

// Books added as default to test layout
addBookToLibrary("Pride and Prejudice", "Jane Austen", 400, "read", "14 Feb 2016", "7 Mar 2016", 4);

addBookToLibrary("Of Mice and Men", "John Steinbeck", 107, "read", "4 Nov 2014", "26 Nov 2014", 3.5);


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

const stars = document.querySelectorAll(".star");

function starReset() {
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove("filled");
    }
}

// Update the form to only show certain fields depending on the value of status


function statusDependentFormUpdate() {
    const currentStatus = statusField.value;

    switch(currentStatus) {
        case "to-read":
            startDateField.value = "";
            endDateField.value = "";
            starReset();
            
            startDateField.disabled = true;
            endDateField.disabled = true;
            ratingFields.disabled = true;
            break;

        case "reading":
            startDateField.disabled = false;
            endDateField.disabled = true;
            ratingFields.disabled = false;
            break;

        case "read":
            startDateField.disabled = false;
            endDateField.disabled = false;
            ratingFields.disabled = false;
            break;
    }
}


statusDependentFormUpdate()

statusField.addEventListener("change", statusDependentFormUpdate);

// Event listener to visually display rating in form when adding a new book

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