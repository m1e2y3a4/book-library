// Library array to store books
const myLibrary = [];

// Book constructor
function Book(title, author, pages, isRead) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// Prototype method to toggle read status
Book.prototype.toggleRead = function () {
  this.isRead = !this.isRead;
};

// Add a new book to the library
function addBookToLibrary(title, author, pages, isRead) {
  const book = new Book(title, author, pages, isRead);
  myLibrary.push(book);
  displayLibrary();
}

// Remove a book from the library by ID
function removeBook(id) {
  const index = myLibrary.findIndex(book => book.id === id);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    displayLibrary();
  }
}

// Display all books on the page
function displayLibrary() {
  const container = document.getElementById("book-container");
  container.innerHTML = "";

  myLibrary.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    card.dataset.id = book.id;

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Status:</strong> <span>${book.isRead ? "Read" : "Not Read"}</span></p>
    `;

    // Toggle read button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Toggle Read";
    toggleBtn.addEventListener("click", () => {
      book.toggleRead();
      displayLibrary();
    });

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeBook(book.id);
    });

    card.appendChild(toggleBtn);
    card.appendChild(removeBtn);
    container.appendChild(card);
  });
}

// Dialog handling
const newBookBtn = document.getElementById("newBookBtn");
const cancelBtn = document.getElementById("cancelBtn");
const bookDialog = document.getElementById("bookDialog");
const bookForm = document.getElementById("bookForm");

newBookBtn.addEventListener("click", () => bookDialog.showModal());
cancelBtn.addEventListener("click", () => bookDialog.close());

bookForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page refresh
  const title = bookForm.title.value.trim();
  const author = bookForm.author.value.trim();
  const pages = parseInt(bookForm.pages.value);
  const isRead = bookForm.isRead.checked;

  if (title && author && !isNaN(pages)) {
    addBookToLibrary(title, author, pages, isRead);
    bookForm.reset();
    bookDialog.close();
  }
});
// Initial setup: Add a sample book
addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, false);
addBookToLibrary("1984", "George Orwell", 328, true);
// Add event listener to close the dialog when clicking outside of it
bookDialog.addEventListener("click", (e) => {
  if (e.target === bookDialog) {
    bookDialog.close();
  }
});