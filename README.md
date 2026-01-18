# Mail

## 📘 Project Description

Mail is a single-page email client application built as part of **CS50’s Web Programming with Python and JavaScript (CS50W)**. The project simulates the core functionality of an email service (similar to Gmail), allowing users to send, receive, read, archive, and reply to emails using a dynamic front-end powered entirely by JavaScript.

The backend API is fully provided, and the primary focus of this project is implementing a responsive **single-page application (SPA)** that communicates with the server using asynchronous API calls (`fetch`) and updates the user interface without reloading the page.

---

## 🎯 Project Objectives

The primary goals of this project are to:

- Build a single-page application using JavaScript
- Interact with a backend API using `fetch`
- Dynamically manipulate the DOM
- Implement mailbox-based email navigation
- Manage application state without page reloads
- Apply client-side logic for reading, archiving, and replying to emails

---

## 🚀 Features

- User registration, login, and logout
- Inbox, Sent, and Archive mailboxes
- Compose and send new emails
- View individual email contents
- Mark emails as read when opened
- Archive and unarchive received emails
- Reply to emails with pre-filled fields
- Dynamic UI updates without page reloads

---

## 🛠️ Technologies Used

- Python  
- Django  
- JavaScript (ES6)  
- HTML & CSS  
- Fetch API  

---

## 📂 Project Structure

- `mail/` – Main application containing views, templates, static files, and API logic  
- `project3/` – Django project configuration  
- `templates/mail/` – HTML templates  
- `static/mail/inbox.js` – JavaScript logic for the SPA (core of the project)  
- `static/mail/styles.css` – Styling for the email client  
- `manage.py` – Django management utility  

---

## 🧠 Learning Outcomes

Through this project, I gained hands-on experience with:

- Building single-page applications (SPAs)
- Making asynchronous API calls using JavaScript
- Rendering dynamic content with DOM manipulation
- Managing multiple UI views in a single page
- Implementing client-side business logic
- Integrating front-end JavaScript with a Django backend

---

## ▶️ Running the Project
1. Install dependencies:
   ```bash
   pip install django
2. Apply migrations:
   ```bash
   python manage.py makemigrations mail
   python manage.py migrate

3. Run the development server:
   ```bash
   python manage.py runserver
4. Open your browser and visit:
   ```bash
   http://127.0.0.1:8000/


