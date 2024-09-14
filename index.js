// import express from 'express';
// import path from 'path';
// import moviesRouter from './routes/movies.js';
// import usersRouter from './routes/users.js';
// import commentsRouter from './routes/comments.js';

// const app = express();
// const PORT = process.env.PORT || 6080;

// // Set up the static directory
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'public')));

// // Set view engine as EJS
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Route handlers
// app.use('/movies', moviesRouter);
// app.use('/users', usersRouter);
// app.use('/comments', commentsRouter);

// // Serve the main page
// app.get('/', (req, res) => {
//     res.render('index');
// });

// // 404 Error handling
// app.use((req, res, next) => {
//     res.status(404).json({ message: 'Not Found' });
// });

// // 500 Internal Error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'Internal Server Error', error: err.message });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

import express from 'express';
import path from 'path';
import moviesRouter from './routes/movies.js';
import usersRouter from './routes/users.js';
import commentsRouter from './routes/comments.js';

const app = express();
const PORT = process.env.PORT || 6080;

// Set up the static directory
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine as EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use('/movies', moviesRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

// Serve the main page
app.get('/', (req, res) => {
    res.render('index');
});

// 404 Error handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// 500 Internal Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
});
