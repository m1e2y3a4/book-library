document.addEventListener("DOMContentLoaded", () => {
  // —— Your classes ——  
  class User {
    constructor(username) {
      this.username = username;
      this.library = new Library();
    }
  }

  class Book {
    static nextId = 0;
    constructor(title, author, pages, isRead) {
      this.id = Book.nextId++;
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.isRead = isRead;
    }
    toggleRead() {
      this.isRead = !this.isRead;
    }
  }

  class Library {
    constructor() {
      this.books = [];
    }
    addBook(title, author, pages, isRead) {
      const book = new Book(title, author, pages, isRead);
      this.books.push(book);
      this.displayLibrary();
    }
    removeBook(id) {
      this.books = this.books.filter(b => b.id !== id);
      this.displayLibrary();
    }
    displayLibrary() {
      const container = document.getElementById("book-container");
      container.innerHTML = "";
      this.books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Pages:</strong> ${book.pages}</p>
          <p><strong>Status:</strong> <span>${book.isRead ? "Read" : "Not Read"}</span></p>
        `;
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Toggle Read";
        toggleBtn.addEventListener("click", () => {
          book.toggleRead();
          this.displayLibrary();
        });
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
          this.removeBook(book.id);
        });
        card.append(toggleBtn, removeBtn);
        container.appendChild(card);
      });
    }
  }

  class UserManager {
    constructor() {
      this.users = [];
      this.currentUser = null;
    }
    addUser(username) {
      if (!username) {
        alert("Username cannot be empty");
        return;
      }
      if (this.users.some(u => u.username === username)) {
        alert("User already exists!");
        return;
      }
      const user = new User(username);
      this.users.push(user);
      this.switchUser(username);
    }
    switchUser(username) {
      const user = this.users.find(u => u.username === username);
      if (!user) {
        alert("User not found!");
        return;
      }
      this.currentUser = user;
      document.getElementById("current-user").textContent =
        `Current User: ${username}`;
      user.library.displayLibrary();
    }
  }

  const userManager = new UserManager();

  // —— Grab elements by ID ——  
  const usernameInput  = document.getElementById("username-input");
  const addUserBtn     = document.getElementById("addUserBtn");
  const switchUserBtn  = document.getElementById("switchUserBtn");
  const newBookBtn     = document.getElementById("newBookBtn");
  const cancelBtn      = document.getElementById("cancelBtn");
  const bookDialog     = document.getElementById("bookDialog");
  const bookForm       = document.getElementById("bookForm");

  // —— User buttons ——  
  addUserBtn.addEventListener("click", () => {
    userManager.addUser(usernameInput.value.trim());
    usernameInput.value = "";
  });

  switchUserBtn.addEventListener("click", () => {
    userManager.switchUser(usernameInput.value.trim());
    usernameInput.value = "";
  });

  // —— Book dialog buttons ——  
  newBookBtn.addEventListener("click", () => bookDialog.showModal());
  cancelBtn.addEventListener("click", () => bookDialog.close());

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title  = bookForm.title.value.trim();
    const author = bookForm.author.value.trim();
    const pages  = parseInt(bookForm.pages.value, 10);
    const isRead = bookForm.isRead.checked;

    if (title && author && !isNaN(pages)) {
      if (userManager.currentUser) {
        userManager.currentUser.library.addBook(title, author, pages, isRead);
      } else {
        alert("Please add or select a user first.");
      }
    }

    bookForm.reset();
    bookDialog.close();
  });

  // close dialog if backdrop clicked
  bookDialog.addEventListener("click", e => {
    if (e.target === bookDialog) bookDialog.close();
  });
});
