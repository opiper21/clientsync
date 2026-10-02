import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, MessageSquare } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  tag: string;
  color: string;
  comments: number;
}

// Mock data — we'll swap this for real API data soon 🔌
const initialTasks: Task[] = [
  { id: 1, title: 'Design Homepage Mockup', tag: 'Design', color: 'bg-purple-500', comments: 3 },
  { id: 2, title: 'Setup MongoDB Database', tag: 'Backend', color: 'bg-green-500', comments: 1 },
  { id: 3, title: 'Integrate Stripe Payments', tag: 'Feature', color: 'bg-blue-500', comments: 5 },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      title: `New Task #${tasks.length + 1}`,
      tag: 'Feature',
      color: 'bg-blue-500',
      comments: 0,
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ClientSync
            </h1>
            <p className="text-gray-400 mt-1">Project: SaaS Landing Page Revamp</p>
          </div>
          <button
            onClick={addTask}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
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

          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-grab active:cursor-grabbing shadow-sm"
              >
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
        </div>
      </div>
    </div>
  );
}

export default App;