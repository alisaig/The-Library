let editingBookId = null;

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
};

// Function to take book info, create a Book object from it and add it to the books map
function addBookToLibrary(title, author, pages, status, startDate, endDate, rating) {
    const book = new Book(title, author, pages, status, startDate, endDate, rating);
    // Generate random id unique to each book
    books.set(crypto.randomUUID(), book);
};

// Books added as default to test layout
addBookToLibrary("Pride and Prejudice", "Jane Austen", "400", "read", "2016-02-14", "2016-03-07", 4);

addBookToLibrary("Of Mice and Men", "John Steinbeck", "107", "read", "2014-11-04", "2014-11-26", 3);

// Function to display star rating in the book table/grid
function displayBookRating(rating, container) {
    for (let i = 0; i < 5; i++) {
        const span = document.createElement("span");
        // Use svgs for stars
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

        svg.classList.add("star");
        // Add yellow fill to an amount of stars equal to the rating
        if (i < rating) svg.classList.add("filled");
        use.setAttribute("href", "#star-icon");

        svg.appendChild(use);
        span.appendChild(svg);
        container.appendChild(span);
    }
}

// Store the books container div in a variable, to add children to later
const booksContainer = document.getElementById("books-container");

function displayBooks() {
    // Reset container so previously displayed books aren't displayed multiple times
    booksContainer.innerHTML = "";

    for (let [bookId, book] of books) {
        const bookRow = document.createElement("div");
        // Add the book's id as an id attribute to each row
        // Id attribute can later be used to determine which book user is clicking to edit/remove
        bookRow.id = bookId;
        bookRow.classList.add("book-row");

        // Create a cell for each book property and fill it with its value
        for (const heading of headings) {
            const bookCell = document.createElement("div");
            if (heading == "rating") {
                displayBookRating(book.rating, bookCell);
            } else if (heading == "startDate" || heading == "endDate") {
                if (book[heading] == null) {
                    // Display N/A if no date available
                    bookCell.textContent = "N/A";
                } else {
                    // Create Date object and format it to look nicer for user
                    const date = new Date(book[heading]);
                    const formattedDate = new Intl.DateTimeFormat("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }).format(date);
                    bookCell.textContent = formattedDate;
                }
            } else {
                bookCell.textContent = book[heading];
            }

            bookRow.appendChild(bookCell);
        };

        // Create cell to store edit and remove buttons
        const actionCell = document.createElement("div");

        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerHTML = "Edit";
        actionCell.appendChild(editButton);

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.innerHTML = "Remove";
        actionCell.appendChild(removeButton);

        bookRow.appendChild(actionCell);

        // Each book from books map has its own row with an id
        // They're all children of the booksContainer div
        booksContainer.appendChild(bookRow);
    };
};

displayBooks();

// Assign all relevant DOM elements to a variable for use in this file
const bookForm = document.querySelector("#book-form");

const titleField = document.querySelector("#title");
const authorField = document.querySelector("#author");
const pagesField = document.querySelector("#pages");
const statusField = document.querySelector("#status");
const startDateField = document.querySelector("#start-date");
const endDateField = document.querySelector("#end-date");
const ratingFields = document.querySelector(".rating-group");
const ratingButtons = document.querySelectorAll(".rating-group input[type='radio']");

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

    // to-read: disable start-date, end-date and rating
    // reading: disable end-date (might want to add rating even if haven't finished book)
    // read: disable nothing
    switch(currentStatus) {
        case "to-read":
            startDateField.value = "";
            endDateField.value = "";
            
            // Uncheck the checked radio button, making rating empty in practice
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

// Run once at page load to disable field associated with the satus default, which is "to-read"
statusDependentFormUpdate()

// Disable relevant fields every time status field option changes
statusField.addEventListener("change", statusDependentFormUpdate);

// Event listener to visually display rating using filled stars when a star is clicked
ratingFields.addEventListener("change", (event) => {
    renderStars(event.target.value);
})

function renderStars(rating) {
    // Value of form element is a string so need to transform it to a number
    const parsedRating = parseInt(rating);

    // Adds a .filled class to any svg star whose index matches or is lower than the rating
    for (let i = 0; i < stars.length; i++) {
        if (i < parsedRating) {
            stars[i].classList.add("filled");
        } else {
            stars[i].classList.remove("filled");
        }
    }
}

// Handle submission of form (pressing the submit button)
function handleBookSubmit(event) {
    // Stop submit from sending data to server as default
    event.preventDefault();
    const form = event.target;
    // Create new FormData object to store data from the form and assign to variable
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
    let startDate = formData.get("start-date") ? formData.get("start-date") : null;
    let endDate = formData.get("end-date") ? formData.get("end-date") : null;
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

    // If editingBookId currently has an id assigned to it, form is in editing mode
    // Editing mode: id (key in books map) used to find book and assign new values to its properties
    if (editingBookId) {
        const currentBook = books.get(editingBookId);

        currentBook.title = formData.get("title");
        currentBook.author = formData.get("author");
        currentBook.pages = formData.get("pages");
        currentBook.status = formData.get("status");
        currentBook.startDate = startDate;
        currentBook.endDate = endDate;
        currentBook.rating = rating;
    } else {
        // If editingBookId is null, form is in add new book mode
        // Create new book object, using spread syntax for first 4 arguments
        addBookToLibrary(...permanentFields, startDate, endDate, rating);
    }
    
    // Close form properly and reset everything properly
    formDialog.close();
    bookForm.reset();
    extraResets();

    // Re-display books to show new entries/changes to existing entries
    displayBooks();

    // Reset form to default add new book mode
    editingBookId = null;
}

// Run handle function when submit button is clicked
bookForm.addEventListener("submit", handleBookSubmit);

// Close book using close button
const closeDialogButton = document.querySelector("#dialog-close");
const formDialog = document.querySelector("#add-book");

// !!!!!!!!!!!!!!!
// Could probably make this into a general closing function to also add to handle submit
// !!!!!!!!!!!!!!!
closeDialogButton.addEventListener("click", () => {
    formDialog.close();
    bookForm.reset();
    extraResets();
    editingBookId = null;
})

// Event delegation to detect which child (book) was selected for editing
booksContainer.addEventListener("click", (event) => {
    const target = event.target;
    // Check if it was an edit button that was clicked
    if (target.classList.contains("edit-button")) {
        const buttonRow = target.closest(".book-row")
        // Retrieve book's id from row's id attribute and assign it to editingBookId
        // When editingBookId has a value/isn't falsy the form is in editing mode
        editingBookId = buttonRow.id;

        // Retrieve book object attached to an id key for editing
        const bookToEdit = books.get(editingBookId);

        // Function to open form to edit
        editForm(bookToEdit);
    }
});

// Function that opens form and fills in all the fieldsets with values from the book's properties
function editForm(book) {
    // Opens dialog containing the form
    formDialog.showModal();

    titleField.value = book.title;
    authorField.value = book.author;
    pagesField.value = book.pages;
    statusField.value = book.status;
    startDateField.value = book.startDate || "";
    endDateField.value = book.endDate || "";

    // As rating uses radio buttons, need to check the right button equal to the current rating
    for (const radio of ratingButtons) {
        if (radio.value == book.rating) {
            radio.checked = true;
        } else {
            radio.checked = false;
        }
    }

    // Display the current star rating
    renderStars(book.rating);
    // Disable any fields associated with current status
    statusDependentFormUpdate();
};

// Extra resets not included in the usual .reset() method
function extraResets() {
    // Grey out all stars
    starReset();
    // Change status back to default
    statusField.value = "to-read";
    // Disable any fields associated with the above default
    statusDependentFormUpdate();
}