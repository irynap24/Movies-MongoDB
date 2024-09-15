// import express from 'express';
// import db from '../db.js'; // Ensure this exports your MongoDB connection
// import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb

// const router = express.Router();

// // GET all comments with pagination
// router.get('/', async (req, res) => {
//     try {
//         const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
//         const skip = (page - 1) * limit;
//         const collection = db.collection('comments');
//         const comments = await collection.find().skip(parseInt(skip)).limit(parseInt(limit)).toArray();
//         res.status(200).json(comments);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving comments', error });
//     }
// });

// // GET comments by movieId with pagination
// router.get('/movie/:movieId', async (req, res) => {
//     try {
//         const { movieId } = req.params;
//         const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
//         const skip = (page - 1) * limit;
//         const collection = db.collection('comments');
//         const comments = await collection.find({ movieId: new ObjectId(movieId) }).skip(parseInt(skip)).limit(parseInt(limit)).toArray();
//         res.status(200).json(comments);
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving comments for movie', error });
//     }
// });

// // POST a new comment
// router.post('/', async (req, res) => {
//     try {
//         const collection = db.collection('comments');
//         const newComment = req.body; // Comment data from request body
//         const result = await collection.insertOne(newComment);
//         res.status(201).json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding comment', error });
//     }
// });

// // PATCH (or PUT) to update an existing comment
// router.patch('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const update = req.body; // Data to update
//         const collection = db.collection('comments');
//         const result = await collection.updateOne(
//             { _id: new ObjectId(id) },
//             { $set: update }
//         );
//         if (result.modifiedCount === 0) {
//             return res.status(404).json({ message: 'Comment not found or no changes made' });
//         }
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating comment', error });
//     }
// });

// // DELETE a comment
// router.delete('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const collection = db.collection('comments');
//         const result = await collection.deleteOne({ _id: new ObjectId(id) });
//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: 'Comment not found' });
//         }
//         res.status(200).json({ message: 'Comment deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting comment', error });
//     }
// });

// export default router;


import express from 'express';
import db from '../db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Validation function for comments
function validateComment(comment) {
    const errors = [];
    if (!comment.text || typeof comment.text !== 'string') {
        errors.push('Invalid comment text');
    }
    if (!comment.movieId || !ObjectId.isValid(comment.movieId)) {
        errors.push('Invalid movie ID');
    }
    return errors;
}

// GET all comments with pagination
// GET all comments with pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
        const skip = (page - 1) * limit;
        const collection = db.collection('comments');
        const totalComments = await collection.countDocuments();
        const comments = await collection.find().skip(parseInt(skip)).limit(parseInt(limit)).toArray();
        const totalPages = Math.ceil(totalComments / limit);
        res.status(200).json({ comments, totalPages });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error });
    }
});


// GET comments by movieId with pagination
router.get('/movie/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const collection = db.collection('comments');
        const comments = await collection.find({ movieId: new ObjectId(movieId) }).skip(skip).limit(parseInt(limit)).toArray();
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
        const errors = validateComment(newComment);
        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        const result = await collection.insertOne(newComment);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
});

// PATCH to update an existing comment
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

