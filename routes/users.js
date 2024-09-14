import express from 'express';
import db from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        const collection = db.collection('users');
        const users = await collection.find().toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
});

// POST a new user
router.post('/', async (req, res) => {
    try {
        const collection = db.collection('users');
        const newUser = req.body;
        const result = await collection.insertOne(newUser);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
    }
});

// PATCH (or PUT) to update an existing user
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const collection = db.collection('users');
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const collection = db.collection('users');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

export default router;
