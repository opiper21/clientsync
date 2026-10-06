import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, MessageSquare, Trash2 } from 'lucide-react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

interface Task {
  _id: string;
  title: string;
  tag: string;
  color: string;
  comments: number;
  status: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // READ — load tasks from MongoDB on mount
  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Failed to fetch tasks:', err))
      .finally(() => setLoading(false));
  }, []);

  // REAL-TIME — live updates from the server
  useEffect(() => {
    socket.on('task:created', (task: Task) => {
      setTasks((prev) =>
        prev.some((t) => t._id === task._id) ? prev : [task, ...prev]
      );
    });
    socket.on('task:deleted', (task: Task) => {
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    });
    return () => {
      socket.off('task:created');
      socket.off('task:deleted');
    };
  }, []);

  // CREATE — save a new task to MongoDB
  const addTask = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `New Task #${tasks.length + 1}`,
          tag: 'Feature',
          color: 'bg-blue-500',
        }),
      });
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  // DELETE — remove a task from MongoDB
  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header - Stacks on mobile, side-by-side on desktop */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ClientSync
            </h1>
            <p className="text-gray-400 mt-1">Project: SaaS Landing Page Revamp</p>
          </div>
          <button
            onClick={addTask}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        {/* Kanban Column */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-200 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              In Progress
              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </h2>
            <MoreHorizontal size={20} className="text-gray-500 cursor-pointer hover:text-gray-300" />
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading tasks from MongoDB…</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-grab active:cursor-grabbing shadow-sm relative group"
                >
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="absolute top-2 right-2 p-2 rounded-md text-gray-500 hover:text-red-400 hover:bg-gray-700/50 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded text-white ${task.color}`}>
                      {task.tag}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-100 mb-3">{task.title}</h3>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Oct 24</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span>{task.comments}</span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  </div>
                </motion.div>
              ))}

              {/* Add Task Button */}
              <button
                onClick={addTask}
                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add a task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;