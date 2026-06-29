# MERN GPT Bot

A full-stack AI chatbot application powered by OpenAI, built with the MERN stack. Supports image uploads via ImageKit, a credit-based usage system with Stripe payments, and secure HTTPS authentication.

---

## Features

- **AI Chat** — Conversational AI powered by OpenAI's GPT API
- **Image Support** — Upload and manage images using ImageKit
- **Credit System** — Buy credits to use the bot via Stripe payments
- **HTTPS Authentication** — Secure login with JWT over HTTPS
- **Chat History** — Persistent conversation history per user
- **Responsive UI** — Clean, modern interface built with React

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React.js, Axios, React Router       |
| Backend      | Node.js, Express.js                 |
| Database     | MongoDB, Mongoose                   |
| AI           | OpenAI API (GPT)                    |
| Media        | ImageKit (image upload & delivery)  |
| Payments     | Stripe (credit purchases)           |
| Auth         | HTTPS Authentication (JWT)          |

---

## Project Structure

```
mern-gpt-bot/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vercel.json
│   └── vite.config.js
│
└── server/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── server.js
    └── vercel.json
```

> Built with the MERN stack + OpenAI
