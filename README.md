# 🌍 WanderLust

WanderLust is a full-stack travel listing web application inspired by Airbnb. Users can create, view, edit, and delete travel listings with server-side validation and proper error handling.

---

## 🚀 Features

- View all travel listings
- Create a new listing
- Edit existing listings
- Delete listings
- Server-side validation using Joi
- Custom Express error handling
- Async error wrapper
- Bootstrap form validation
- RESTful routing
- MongoDB database with Mongoose

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- Bootstrap 5
- EJS
- EJS-Mate

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

---

## 📁 Project Structure

```
wanderlust/
│
├── models/
│   └── listing.js
│
├── public/
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── views/
│   ├── includes/
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   │
│   ├── layout/
│   │   └── boilerplate.ejs
│   │
│   └── listing/
│       ├── index.ejs
│       ├── new.ejs
│       ├── edit.ejs
│       ├── show.ejs
│       └── error.ejs
│
├── schema.js
├── app.js
├── package.json
└── README.md
```

---

## 📦 Installation

Clone the repository

```bash
git clone https://github.com/your-username/wanderlust.git
```

Move into the project

```bash
cd wanderlust
```

Install dependencies

```bash
npm install
```

Start MongoDB

```bash
mongod
```

Run the server

```bash
nodemon app.js
```

Visit

```
http://localhost:3000
```

---

## 📌 Routes

| Method | Route | Description |
|---------|-------|-------------|
| GET | /listings | Show all listings |
| GET | /listings/new | Create form |
| POST | /listings | Add listing |
| GET | /listings/:id | Show single listing |
| GET | /listings/:id/edit | Edit form |
| PUT | /listings/:id | Update listing |
| DELETE | /listings/:id | Delete listing |

---

## ✅ Validation

Server-side validation is implemented using **Joi**.

Example validations include:

- Title is required
- Price must be a number
- Country is required
- Location is required
- Image URL validation

---

## ⚠ Error Handling

The project includes:

- Custom `ExpressError` class
- `wrapAsync()` utility for async routes
- Centralized error-handling middleware
- 404 Page Not Found handler

---

## 📚 Packages Used

- express
- mongoose
- ejs
- ejs-mate
- method-override
- joi
- nodemon

---

## 🎯 Future Improvements

- User Authentication
- Login & Signup
- Authorization
- Image Upload with Cloudinary
- Reviews & Ratings
- Maps Integration
- Search & Filters
- Favorites (Wishlist)

---

## 👨‍💻 Author

Developed as part of a Full Stack Web Development learning project.
