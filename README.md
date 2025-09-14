# express-library-api

## Overview
The **Library API** is a RESTful service for managing a library system. It allows CRUD operations for **Authors** and **Books**, including search, sorting and filtering. The system validates inputs and handles errors gracefully.


## Features
- CRUD for Authors and Books  
- Search books by title, author, or year  
- Filter, sort, and paginate results  
- Input validation for POST and PUT  
- Error handling for invalid data, duplicates, and missing resources  
- Logger middleware for request tracking  

---

## API Endpoints 
 
## Authors

**GET** : `/authors` -- List all authors             
**GET** : `/authors/:id` -- Get author by ID             
**POST** : `/authors` -- Create a new author          
**PUT** : `/authors/:id` -- Update an author             
**DELETE** : `/authors/:id` --  Delete an author             
**GET** : `/authors/:id/books` -- List all books for an author 

## Books

**GET** : `/books` -- List all books 
**GET**    : `/books/:id` -- Get book by ID 
**POST**   : `/books` -- Create a new book 
**PUT**    : `/books/:id` -- Update a book 
**DELETE** : `/books/:id` -- Delete a book 

---

### Query Parameters for /books

- title -- filter by book title

- year -- filter by publication year

- sortBy -- title or year

---

## Error Handling

- 400 Bad Request -- validation failed or invalid authorId

- 404 Not Found -- author or book not found

- 409 Conflict -- duplicate book for same author

## Technologies
- Node.js  
- TypeScript  
- Express.js  
- express-validator  

---


## Installation

   ``cmd
    git clone https://github.com/Karabo5/express-library-api.git
    cd express-library-api
    code .

   ``bash
    git checkout dev
    npm install
    npm run dev


## Installation Postman Test Cases for Library API

## Authors Endpoints

### List all authors
GET http://localhost:5000/v1/authors

### Get an author by ID
GET http://localhost:5000/v1/authors/1

### Create a new author
POST http://localhost:5000/v1/authors

Body:
{
  "name": "Karabo",
  "surname": "Mogano"
}

### Update an author
PUT http://localhost:5000/v1/authors/1

Body:
{
  "name": "Updated Name",
  "surname": "Updated Surname"
}

### Get all books for a specific author
GET http://localhost:8000/v1/authors/2/books


### Books Endpoints

### List all books
GET http://localhost:5000/v1/books

### Get a book by ID
GET http://localhost:5000/v1/books/2

### Create a new book
POST http://localhost:5000/v1/books

{
  "title": "Her brown eyes, my answer found",
  "year": 2024,
  "authorId": 2
}

### Update a book
PUT http://localhost:5000/v1/books/2

Body:
{
  "title": "Updated Book Title",
  "year": 2025,
  "authorId": 1
}

### Delete a book 
DELETE http://localhost:5000/v1/books/2


### Query Parameters
1
**Filter books by title**
GET http://localhost:5000/v1/books?title=eyes

**Filter books by year**
GET http://localhost:5000/v1/books?year=2024

**Sort books by title**
GET http://localhost:5000/v1/books?sortBy=title

**Sort books by year**
GET http://localhost:5000/v1/books?sortBy=year
