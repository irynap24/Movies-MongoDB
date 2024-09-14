import express from 'express';
import path from 'path'; // Import path module
import moviesRouter from './routes/movies.js';
import usersRouter from './routes/users.js';
import commentsRouter from './routes/comments.js';

const app = express();
const PORT = process.env.PORT || 6080;

// Get __dirname equivalent in ES modules
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Hardcode the path to the views directory using __dirname
const viewsPath = path.join(__dirname, 'views'); // Update if necessary

// Set the view engine to EJS and specify the path to the views directory
app.set('view engine', 'ejs');
app.set('views', viewsPath);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/movies', moviesRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

// Serve index.ejs on the root route
app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs from the views directory
});

// Handle 404 - Not Found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// Handle 500 - Internal Server Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
