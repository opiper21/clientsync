import { Router } from 'express';
import Task from '../models/Task';
import type { Server } from 'socket.io';

export default function taskRoutes(io: Server) {
  const router = Router();

  router.get('/', async (_req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  });

  router.post('/', async (req, res) => {
    const task = await Task.create(req.body);
    io.emit('task:created', task);
    res.status(201).json(task);
  });

  router.put('/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    io.emit('task:updated', task);
    res.json(task);
  });

  router.delete('/:id', async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    io.emit('task:deleted', task);
    res.json({ message: 'Task deleted' });
  });

  return router;
}