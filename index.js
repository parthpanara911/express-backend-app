const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

const users = [];
const questions = [];
const submissions = [];

function generateToken() {
    return crypto.randomBytes(16).toString('hex'); // 32-char random string
}

app.post('/signup', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email & password required" });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ email, password });
    res.status(200).json({ message: "Signup successful" });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken();
    user.token = token;  // attach token to user record

    res.status(200).json({ message: "Login successful", token });
});

// Middleware : Authenticate user via token
function authenticate(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const user = users.find(u => u.token === token);
    if (!user) {
        return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; // attach user to request
    next();
}

app.get('/questions', (req, res) => {
    res.send('Hello World!')
});

app.get('/submissions', (req, res) => {
    res.send('Hello World!')
});

app.post('/submissions', (req, res) => {
    res.send('Hello World!')
});

app.post('/logout', authenticate, (req, res) => {
    req.user.token = null;
    res.json({ message: "Logged out successfully" });
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
