# 🏫 School Management API

A Node.js + Express + MySQL-based REST API that allows users to:

- ✅ Add new schools with location data
- 📍 Retrieve a list of nearby schools sorted by distance from user’s coordinates

---

## 🚀 Features

- Add a school with name, address, latitude & longitude
- List all schools within 50 km of a given location
- Input validation and error handling
- Clean and styled HTML form for adding schools

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MySQL
- HTML/CSS (for UI)
- dotenv (for environment variables)

---

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/sapekshpareek/educase-backend.git
cd educase-backend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL database

* Open MySQL and run the `setup.sql` file:

```sql
CREATE DATABASE IF NOT EXISTS educase_backend;

USE educase_backend;

CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT,
    longitude FLOAT
);
```

### 4. Configure environment variables

Create a `.env` file in the root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management_api
```

### 5. Start the server

```bash
node app.js
```

API runs on: `http://localhost:3000`

---

## 🌐 API Endpoints

### ➕ Add School

* **POST** `/addSchool`
* **Body (JSON)**:

```json
{
  "name": "ABC School",
  "address": "123 Street",
  "latitude": 22.678210,
  "longitude": 74.944830
}
```

---

### 📍 List Nearby Schools

* **GET** `/listSchool?latitude=22.678210&longitude=74.944830`

Returns schools within 50 km, sorted by distance.

---

## 🖥️ Frontend (Optional UI)

* Visit `http://localhost:3000/addSchool`
* Fill the HTML form to add schools easily

---