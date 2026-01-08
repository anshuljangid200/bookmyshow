import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Event from '../models/Event.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Auth Middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin Login
router.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
});

// CRUD - GET all events with search
router.get('/events', async (req: Request, res: Response) => {
    try {
        const { search, category } = req.query;
        let query: any = {};

        if (search) {
            query.title = { $regex: search as string, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        const events = await Event.find(query).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// CRUD - POST create
router.post('/events', authenticate, async (req: Request, res: Response) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// CRUD - PUT update
router.put('/events/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// CRUD - DELETE
router.delete('/events/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const deleted = await Event.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
