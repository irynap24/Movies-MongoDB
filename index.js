import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import moviesRouter from './routes/movies.js';
import usersRouter from './routes/users.js';
import commentsRouter from './routes/comments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define your API routes
app.use('/movies', moviesRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

// Error handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
