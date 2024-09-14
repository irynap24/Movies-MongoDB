import express from 'express';
import db from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET all movies
router.get('/', async (req, res) => {
    try {
        const collection = db.collection('movies');
        const movies = await collection.find().limit(10).toArray();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movies', error });
    }
});

// POST a new movie
router.post('/', async (req, res) => {
    try {
        const collection = db.collection('movies');
        const newMovie = req.body;
        const result = await collection.insertOne(newMovie);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding movie', error });
    }
});

// PATCH (or PUT) to update an existing movie
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
