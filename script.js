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
    // There may not be a rating field included in the form submission
    // If statement to avoid error from running function on falsy value
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
addBookToLibrary("Pride and Prejudice", "Jane Austen", 400, "read", new Date("2016-02-14"), new Date("2016-03-07"), 4);

addBookToLibrary("Of Mice and Men", "John Steinbeck", 107, "read", new Date("2014-11-04"), new Date("2014-11-26"), 3);

function displayBookRating(rating, container) {
    for (let i = 0; i < 5; i++) {
        const span = document.createElement("span");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

        svg.classList.add("star");
        if (i < rating) svg.classList.add("filled");
        use.setAttribute("href", "#star-icon");

        svg.appendChild(use);
        span.appendChild(svg);
        container.appendChild(span);
    }
}

function displayBooks() {
    // Store the books container div in a variable, to add children to later
    const booksContainer = document.getElementById("books-container");

    booksContainer.innerHTML = "";

    for (const book of books.values()) {
        const bookRow = document.createElement("div");
        bookRow.id = book.id;
        bookRow.classList.add("book-row");

        for (const heading of headings) {
            const bookCell = document.createElement("div");
            if (heading == "rating") {
                displayBookRating(book.rating, bookCell);
            } else if (heading == "startDate" || heading == "endDate") {
                if (book[heading] == null) {
                    bookCell.textContent = "N/A";
                } else {
                    const formattedDate = new Intl.DateTimeFormat("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }).format(book[heading]);
                    bookCell.textContent = formattedDate
                };
            } else {
                bookCell.textContent = book[heading];
            }

            bookRow.appendChild(bookCell);
        };

        const actionCell = document.createElement("div");

        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        actionCell.appendChild(editButton);

        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        actionCell.appendChild(removeButton);

        bookRow.appendChild(actionCell);

        booksContainer.appendChild(bookRow);
    };
};

displayBooks();


const statusField = document.querySelector("#status");
const startDateField = document.querySelector("#start-date");
const endDateField = document.querySelector("#end-date");
const ratingFields = document.querySelector(".rating-group");

const stars = ratingFields.querySelectorAll(".star");

// Visual reset of the stars representing the rating
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
            
            const selectedRating = document.querySelector("input[name='rating']:checked");
            if (selectedRating) selectedRating.checked = false;
            starReset();
            
            startDateField.disabled = true;
            endDateField.disabled = true;
            ratingFields.disabled = true;
            break;

        case "reading":
            endDateField.value = "";
            
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

const bookForm = document.querySelector("#book-form");

function handleBookSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Add form field values that don't get disabled at any point to an array
    const permanentFields = [
        formData.get("title"),
        formData.get("author"),
        formData.get("pages"),
        formData.get("status")
    ]

    // These form fields can get disabled when filling form
    // So need to ensure their values are either the expected ones or null
    let startDate = formData.get("start-date") ? new Date(formData.get("start-date")) : null;
    let endDate = formData.get("end-date") ? new Date(formData.get("start-date")) : null;
    let rating = formData.get("rating") ? parseInt(formData.get("rating")) : null;

    // Another check to ensure values are as expected according to status
    switch(formData.get("status")) {
        // Want first case to fall through so endDate is also null
        case "to-read":
            startDate = null;
            rating = null;
        case "reading":
            endDate = null;
        case "read":
            break;
    }

    // Create new book object, using spread syntax for first 4 arguments
    addBookToLibrary(...permanentFields, startDate, endDate, rating);

    
    displayBooks();
}

bookForm.addEventListener("submit", handleBookSubmit);