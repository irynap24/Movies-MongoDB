

import express from 'express';
import db from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Validation function for movies
function validateMovie(movie) {
    const errors = [];
    if (!movie.title || typeof movie.title !== 'string') {
        errors.push('Invalid movie title');
    }
    if (movie.plot && typeof movie.plot !== 'string') {
        errors.push('Invalid plot');
    }
    return errors;
}

// GET all movies with pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
        const skip = (page - 1) * limit;
        const collection = db.collection('movies');
        const totalMovies = await collection.countDocuments();
        const movies = await collection.find().skip(parseInt(skip)).limit(parseInt(limit)).toArray();
        const totalPages = Math.ceil(totalMovies / limit);
        res.status(200).json({ movies, totalPages });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movies', error });
    }
});


// POST a new movie
router.post('/', async (req, res) => {
    try {
        const collection = db.collection('movies');
        const newMovie = req.body;
        const errors = validateMovie(newMovie);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        const result = await collection.insertOne(newMovie);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding movie', error });
    }
});

// PATCH to update an existing movie
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const collection = db.collection('movies');
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Movie not found or no changes made' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating movie', error });
    }
});

// DELETE a movie
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = db.collection('movies');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting movie', error });
    }
});

export default router;

