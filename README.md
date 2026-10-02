# 🌍 WanderLust

**WanderLust** is a full-stack travel and property listing web application inspired by modern vacation-rental platforms. It allows authenticated users to create and manage travel listings, upload listing images, view locations on an interactive map, and leave reviews with ratings.

The application follows a modular **MVC-style Express architecture** with MongoDB/Mongoose for data persistence and EJS for server-rendered views.

---

## ✨ Features

### 🏡 Listing Management

- Browse all available listings
- View detailed information about individual listings
- Create new travel/property listings
- Upload listing images using **Cloudinary**
- Edit listings owned by the logged-in user
- Delete listings owned by the logged-in user
- Display listing price, location, country, description, and owner information

### 🔐 Authentication & Authorization

- User registration and login
- Session-based authentication using **Passport.js**
- Password authentication using `passport-local-mongoose`
- Persistent sessions using **connect-mongo**
- Protected routes for creating listings and reviews
- Listing ownership authorization for edit/delete operations
- Review-author authorization for deleting reviews
- Redirect users back to the originally requested protected page after login

### ⭐ Reviews & Ratings

- Authenticated users can submit reviews
- Reviews support a **1–5 star rating**
- Reviews are associated with users
- Users can delete their own reviews
- Review authors are populated on listing pages
- Server-side review validation using **Joi**

### 🗺️ Location & Maps

- Listing locations are converted into geographic coordinates using the **Mapbox Geocoding API**
- Listing coordinates are stored as GeoJSON `Point` data
- Individual listing pages display an interactive **Mapbox GL JS** map
- A map marker identifies the listing location

### ☁️ Image Uploads

- Image uploads handled using **Multer**
- Images stored using **Cloudinary**
- Cloudinary storage integrated with `multer-storage-cloudinary`
- Supported image formats include:
  - PNG
  - JPG
  - JPEG

### 🛡️ Validation & Error Handling

- Server-side validation using **Joi**
- Custom `ExpressError` class
- Centralized Express error-handling middleware
- Async route error handling using `wrapAsync`
- Custom 404 handling
- Client-side Bootstrap form validation

### 🎨 User Interface

- Server-rendered pages using **EJS**
- EJS layouts using **EJS-Mate**
- Responsive design using **Bootstrap 5**
- Custom CSS styling
- Star-based review interface
- Responsive listing cards
- Category-style filter UI
- GST display toggle on listing cards

> **Note:** The destination search and category filter UI are currently present visually, but their backend filtering/search functionality has not been implemented yet.

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- EJS
- EJS-Mate
- Bootstrap 5
- Font Awesome
- Mapbox GL JS

### Backend

- Node.js
- Express.js
- Passport.js
- Passport Local Strategy
- Multer
- Joi
- Method Override
- Connect Flash

### Database & Storage

- MongoDB
- Mongoose
- MongoDB Atlas
- Connect Mongo
- Cloudinary

### APIs & Services

- Mapbox Geocoding API
- Mapbox GL JS
- Cloudinary

---

## 🏗️ Project Architecture

The project follows a modular MVC-style architecture.

```text
WANDERLUST/
│
├── app.js
├── cloudConfig.js
├── middileware.js
├── schema.js
├── package.json
├── package-lock.json
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listings.js
│   ├── review.js
│   └── user.js
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── init/
│   ├── data.js
│   └── index.js
│
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── rating.css
│   │
│   └── js/
│       ├── map.js
│       └── script.js
│
└── views/
    ├── includes/
    │   ├── flash.ejs
    │   ├── footer.ejs
    │   └── navbar.ejs
    │
    ├── layout/
    │   └── boilerplate.ejs
    │
    ├── listing/
    │   ├── index.ejs
    │   ├── new.ejs
    │   ├── show.ejs
    │   ├── edit.ejs
    │   └── error.ejs
    │
    └── users/
        ├── login.ejs
        └── signup.ejs
```

---

## 🔄 How the Application Works

### Listing Creation Flow

```text
User
  │
  ▼
Create Listing Form
  │
  ├── Joi Validation
  │
  ├── Multer
  │
  ├── Cloudinary Image Upload
  │
  ├── Mapbox Geocoding
  │
  ▼
Listing Controller
  │
  ▼
Mongoose
  │
  ▼
MongoDB
```

When a listing is created:

1. The user must be authenticated.
2. Listing data is validated using Joi.
3. The uploaded image is processed by Multer.
4. The image is uploaded to Cloudinary.
5. The location is sent to Mapbox Geocoding.
6. Mapbox returns geographic coordinates.
7. The listing is saved in MongoDB with its owner, image information, and GeoJSON geometry.

---

## 🗄️ Database Models

### User

The `User` model stores:

- Email
- Username
- Password authentication data managed by `passport-local-mongoose`

### Listing

A listing contains:

- Title
- Description
- Image URL
- Cloudinary filename
- Price
- Location
- Country
- Owner reference
- Review references
- GeoJSON `Point` geometry

### Review

A review contains:

- Comment
- Rating from 1 to 5
- Creation date
- Author reference

### Relationships

```text
User
 ├── owns ───────────────► Listings
 └── writes ─────────────► Reviews

Listing
 ├── belongs to ─────────► User
 └── contains ───────────► Reviews

Review
 ├── belongs to ─────────► User
 └── is attached to ─────► Listing
```

---

## 🔐 Authentication & Authorization

WanderLust uses **Passport Local** for authentication.

### Authentication

- Signup creates a new user
- Password hashing and authentication helpers are provided by `passport-local-mongoose`
- Login uses Passport's local strategy
- User sessions are stored in MongoDB
- Logout destroys the authenticated session

### Authorization

The application uses custom middleware:

- `isLoggedIn` → requires authentication
- `isOwner` → allows only the listing owner to edit/delete a listing
- `isReviewAuthor` → allows only the review author to delete a review

This prevents users from modifying resources they do not own.

---

## 🧪 Validation

Joi schemas are defined in:

```text
schema.js
```

### Listing Validation

The application validates:

- Title
- Description
- Price
- Location
- Country
- Image

The price must be a number greater than or equal to `0`.

### Review Validation

The application validates:

- Rating between `1` and `5`
- Required review comment

Validation takes place on the server before controller logic is executed.

---

## 🛣️ Routes

### Listings

| Method | Route | Description | Authentication |
|---|---|---|---|
| GET | `/listings` | Display all listings | No |
| GET | `/listings/new` | Display listing creation form | Yes |
| POST | `/listings` | Create a listing | Yes |
| GET | `/listings/:id` | Display a single listing | No |
| GET | `/listings/:id/edit` | Display edit form | Owner |
| PUT | `/listings/:id` | Update a listing | Owner |
| DELETE | `/listings/:id` | Delete a listing | Owner |

### Reviews

| Method | Route | Description | Authentication |
|---|---|---|---|
| POST | `/listings/:id/reviews` | Create a review | Yes |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Review Author |

### Users

| Method | Route | Description |
|---|---|---|
| GET | `/signup` | Signup page |
| POST | `/signup` | Register a user |
| GET | `/login` | Login page |
| POST | `/login` | Authenticate user |
| GET | `/logout` | Log out user |

---

## 🔑 Environment Variables

The project keeps credentials outside the source code.

Create a `.env` file in the project root:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_access_token
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `ATLASDB_URL` | MongoDB/Atlas connection |
| `SECRET` | Express session secret |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |
| `MAP_TOKEN` | Mapbox access token |

**Never commit your `.env` file or API credentials to GitHub.**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Open the Project

```bash
cd WANDERLUST
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root and add the required variables.

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_access_token
```

### 5. Start the Application

```bash
node app.js
```

The application will run on:

```text
http://localhost:3000
```

> The current `package.json` does not define a `start` or `dev` npm script. If you use Nodemon, you can run:
>
> ```bash
> npx nodemon app.js
> ```

---

## 🌱 Sample Data

Sample listing data is available in:

```text
init/data.js
```

The initialization script is located at:

```text
init/index.js
```

It can:

1. Connect to MongoDB
2. Delete existing listings
3. Geocode listing locations using Mapbox
4. Generate GeoJSON coordinates
5. Assign an owner ID
6. Insert the sample listings into MongoDB

### ⚠️ Important

The initialization script deletes existing listings before inserting sample data.

**Do not run this script against a production database unless you intentionally want to delete the existing listings.**

The script also uses a predefined owner ObjectId, so the corresponding user should exist in the database.

---

## 📁 Important Files

| File | Purpose |
|---|---|
| `app.js` | Express application setup, database connection, sessions, Passport, routes and error handling |
| `models/listing.js` | Listing database schema |
| `models/review.js` | Review database schema |
| `models/user.js` | User authentication schema |
| `controllers/listings.js` | Listing business logic |
| `controllers/reviews.js` | Review business logic |
| `controllers/users.js` | User authentication logic |
| `middileware.js` | Authentication, authorization and validation middleware |
| `schema.js` | Joi validation schemas |
| `cloudConfig.js` | Cloudinary configuration |
| `routes/listings.js` | Listing routes |
| `routes/review.js` | Review routes |
| `routes/user.js` | Authentication routes |
| `public/js/map.js` | Mapbox map and listing marker |
| `utils/wrapAsync.js` | Async error forwarding utility |
| `utils/ExpressError.js` | Custom application error class |

---

## 📦 Main Dependencies

Some of the major packages used in the project are:

```text
express
mongoose
ejs
ejs-mate
passport
passport-local
passport-local-mongoose
express-session
connect-mongo
connect-flash
cloudinary
multer
multer-storage-cloudinary
@mapbox/mapbox-sdk
joi
method-override
dotenv
```

The complete dependency list and exact versions are available in:

```text
package.json
package-lock.json
```

---

## 🔒 Security Considerations

Before deploying the project to production:

- Keep `.env` credentials private
- Use a strong session secret
- Configure secure cookies when using HTTPS
- Restrict Cloudinary and Mapbox credentials where applicable
- Use production environment settings
- Review error messages before exposing the application publicly
- Do not run the destructive sample-data initialization script on a production database

---

## 📌 Current Project Status

The current codebase implements the core full-stack functionality for:

- User authentication
- Listing CRUD operations
- Image uploads
- Cloudinary image storage
- Reviews and ratings
- Ownership-based authorization
- MongoDB persistence
- Mapbox geocoding
- Interactive listing maps
- Server-side validation
- MongoDB session storage
- Flash messages
- Centralized error handling

Some UI elements are currently present without corresponding backend functionality, including:

- Destination search
- Category-based filtering

---

## 🔮 Future Enhancements

Possible future improvements include:

- Implement destination search
- Connect category filters to database queries
- Add sorting and price filters
- Add wishlist/favorites
- Add booking/reservation functionality
- Add pagination
- Add image deletion from Cloudinary when listings are deleted
- Add automated testing
- Add production deployment configuration
- Add API endpoints for a separate frontend
- Improve accessibility
- Add user profile management

---

## 👨‍💻 Author

**Vedant Sharma**

Full-Stack Web Development Project

---

## 📄 License

This project is licensed under the **ISC License**, as specified in `package.json`.
