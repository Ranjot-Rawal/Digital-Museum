// ============================================================
// CHRONICLE NEXUS BACKEND - FIXED VERSION
// Uses SAME model as your original frontend: gemini-3.5-flash
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const { appendFile, mkdir } = require('node:fs/promises');
require('dotenv').config();

const app = express();
const projectRoot = path.resolve(__dirname, '..');
app.set('view engine', 'ejs');
app.set('views', path.join(projectRoot, 'pages'));
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const contactMessagesDirectory = path.join(__dirname, 'data');
const contactMessagesFile = path.join(contactMessagesDirectory, 'contact-messages.jsonl');

app.get(['/contact', '/contact.ejs', '/pages/contact.html', '/pages/contact.ejs'], (req, res) => {
    res.render('contact', {
        pageTitle: 'Contact | Chronicle Nexus',
        navLinks: [
            { label: 'Home', url: '/pages/index.html' },
            { label: 'Gallery', url: '/pages/gallery.html' },
            { label: 'Ancient India', url: '/pages/ancient-india.html' },
            { label: 'Freedom Fighters', url: '/pages/freedom-fighters.html' },
            { label: 'Space Museum', url: '/pages/space-museum.html' },
            { label: 'Contact', url: '/contact', active: true }
        ],
        contactInfo: [],
        siteName: 'Chronicle Nexus',
        year: new Date().getFullYear()
    });
});

app.post('/api/contact', async (req, res) => {
    const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
        ? req.body
        : {};
    const fields = ['name', 'email', 'subject', 'message'];
    const contact = Object.fromEntries(fields.map((field) => [
        field,
        typeof body[field] === 'string' ? body[field].trim() : ''
    ]));
    const errors = {};

    if (!contact.name) {
        errors.name = 'Please enter your name.';
    } else if (contact.name.length > 100) {
        errors.name = 'Name must be 100 characters or fewer.';
    }

    if (!contact.email) {
        errors.email = 'Please enter your email address.';
    } else if (
        contact.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
    ) {
        errors.email = 'Please enter a valid email address.';
    }

    if (contact.subject.length > 150) {
        errors.subject = 'Subject must be 150 characters or fewer.';
    }

    if (!contact.message) {
        errors.message = 'Please enter a message.';
    } else if (contact.message.length > 500) {
        errors.message = 'Message must be 500 characters or fewer.';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: 'Please correct the highlighted fields.',
            errors
        });
    }

    try {
        await mkdir(contactMessagesDirectory, { recursive: true });
        await appendFile(contactMessagesFile, `${JSON.stringify({
            ...contact,
            receivedAt: new Date().toISOString()
        })}\n`, 'utf8');

        return res.status(201).json({
            message: 'Your message was received and saved.'
        });
    } catch (error) {
        console.error('Unable to save contact message:', error);
        return res.status(500).json({
            message: 'We could not save your message. Please try again later.'
        });
    }
});

// AI Chat Route
app.post('/api/chat', async (req, res) => {

    const { question, prompt } = req.body;

    
    if (!question) {
        return res.status(400).json({ error: 'No question provided' });
    }

    try {
        // EXACT SAME URL as your original frontend had:
        // gemini-3.5-flash (not gemini-2.0-flash)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt || question }] }]
                })
            }
        );

        const data = await response.json();

        // Check if Gemini returned an error
        if (data.error) {
            console.log('Gemini Error:', data.error);
            return res.status(500).json({ 
                answer: "AI service error: " + data.error.message 
            });
        }

        // Extract answer safely
        let answer = "I'm sorry, I couldn't generate a response.";

        if (data.candidates && data.candidates[0] && 
            data.candidates[0].content && 
            data.candidates[0].content.parts && 
            data.candidates[0].content.parts[0]) {
            answer = data.candidates[0].content.parts[0].text;
        }

        res.json({ answer: answer });

    } catch (error) {
        console.log('Server Error:', error.message);
        res.status(500).json({ 
            answer: "AI is temporarily busy. Please try again later." 
        });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Chronicle Nexus Backend is running!',
        endpoints: ['/api/chat']
    });
});

// Test endpoint - helps debug
app.get('/test', (req, res) => {
    res.json({
        apiKeyExists: !!GEMINI_API_KEY,
        apiKeyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
        apiKeyStart: GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'MISSING'
    });
});

app.use('/assets', express.static(path.join(projectRoot, 'assets')));
app.use('/css', express.static(path.join(projectRoot, 'css')));
app.use('/js', express.static(path.join(projectRoot, 'js')));
app.use('/pages', express.static(path.join(projectRoot, 'pages')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('');
    console.log('========================================');
    console.log('  CHRONICLE NEXUS BACKEND ONLINE');
    console.log('========================================');
    console.log('  Server: http://localhost:' + PORT);
    console.log('  Contact: http://localhost:' + PORT + '/contact');
    console.log('  Test:   http://localhost:' + PORT + '/test');
    console.log('  AI:     POST /api/chat');
    console.log('========================================');
    console.log('');
});
