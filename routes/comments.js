import express from 'express';
import db from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET all comments
router.get('/', async (req, res) => {
    try {
        const collection = db.collection('comments');
        const comments = await collection.find().toArray();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error });
    }
});

// GET comments by movieId
router.get('/movie/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const collection = db.collection('comments');
        const comments = await collection.find({ movieId: new ObjectId(movieId) }).toArray();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments for movie', error });
    }
});

// POST a new comment
router.post('/', async (req, res) => {
    try {
        const collection = db.collection('comments');
        const newComment = req.body;
        const result = await collection.insertOne(newComment);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
});

// PATCH (or PUT) to update an existing comment
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const collection = db.collection('comments');
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Comment not found or no changes made' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error });
    }
});

// DELETE a comment
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = db.collection('comments');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
});

export default router;
