import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  completedAt?: Date;
}

type FilterType = 'all' | 'active' | 'completed';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('industrial-tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: Task) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
      }));
    }
    return [
      { id: '1', text: 'Review project specifications', completed: false, priority: 'high', createdAt: new Date() },
      { id: '2', text: 'Update documentation', completed: false, priority: 'medium', createdAt: new Date() },
      { id: '3', text: 'Schedule team standup', completed: true, priority: 'low', createdAt: new Date(), completedAt: new Date() },
    ];
  });

  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<FilterType>('all');
  const [stampedId, setStampedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('industrial-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      priority,
      createdAt: new Date(),
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setStampedId(id);
    setTimeout(() => setStampedId(null), 600);

    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : undefined }
        : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const priorityColors = {
    low: 'bg-emerald-600',
    medium: 'bg-amber-500',
    high: 'bg-red-500',
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f0e6] relative overflow-hidden">
      {/* Industrial Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 50px, #c49a6c 50px, #c49a6c 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, #c49a6c 50px, #c49a6c 51px)
          `,
        }} />
      </div>

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-0">
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-[#ff6b35] rounded-full animate-pulse" />
                <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-[#c49a6c] uppercase">System Online</span>
              </div>
              <h1 className="font-oswald text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase">
                Task <span className="text-[#ff6b35]">Factory</span>
              </h1>
              <p className="font-mono text-xs md:text-sm text-[#8a8a8a] mt-1 md:mt-2">PRODUCTION MANAGEMENT UNIT v2.4</p>
            </div>

            {/* Industrial Gauge */}
            <div className="flex items-center gap-4 md:gap-6">
              <GaugeDisplay percentage={completionPercentage} />
              <div className="text-right">
                <p className="font-mono text-[10px] md:text-xs text-[#8a8a8a] uppercase tracking-widest">Output</p>
                <p className="font-oswald text-2xl md:text-3xl lg:text-4xl font-bold text-[#c49a6c]">
                  {completedCount}<span className="text-[#5a5a5a]">/{totalCount}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#252525] border border-[#3a3a3a] rounded-sm p-4 md:p-6 mb-6 md:mb-8 relative overflow-hidden"
        >
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-4 md:w-6 h-4 md:h-6 border-t-2 border-l-2 border-[#ff6b35]" />
          <div className="absolute top-0 right-0 w-4 md:w-6 h-4 md:h-6 border-t-2 border-r-2 border-[#ff6b35]" />
          <div className="absolute bottom-0 left-0 w-4 md:w-6 h-4 md:h-6 border-b-2 border-l-2 border-[#ff6b35]" />
          <div className="absolute bottom-0 right-0 w-4 md:w-6 h-4 md:h-6 border-b-2 border-r-2 border-[#ff6b35]" />

          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <label className="font-mono text-[10px] md:text-xs text-[#6a6a6a] uppercase tracking-widest block mb-2">
                New Work Unit
              </label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Enter task description..."
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-sm px-4 py-3 font-mono text-sm text-[#f5f0e6] placeholder-[#5a5a5a] focus:outline-none focus:border-[#ff6b35] transition-colors"
              />
            </div>

            <div className="flex gap-3 md:gap-4">
              <div className="flex-1 md:flex-initial">
                <label className="font-mono text-[10px] md:text-xs text-[#6a6a6a] uppercase tracking-widest block mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full md:w-auto bg-[#1a1a1a] border border-[#3a3a3a] rounded-sm px-4 py-3 font-mono text-sm text-[#f5f0e6] focus:outline-none focus:border-[#ff6b35] transition-colors cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={addTask}
                  className="bg-[#ff6b35] hover:bg-[#ff8555] text-[#1a1a1a] font-oswald font-bold uppercase tracking-wider px-5 md:px-8 py-3 rounded-sm transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px]"
                >
                  <span className="hidden md:inline">Deploy</span>
                  <span className="md:hidden">+</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 mb-4 md:mb-6 bg-[#252525] p-1 rounded-sm w-fit border border-[#3a3a3a]"
        >
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 md:px-6 py-2 md:py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 rounded-sm min-h-[44px] ${
                filter === f
                  ? 'bg-[#ff6b35] text-[#1a1a1a] font-bold'
                  : 'text-[#8a8a8a] hover:text-[#f5f0e6]'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Task List */}
        <div className="space-y-2 md:space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`group bg-[#252525] border border-[#3a3a3a] rounded-sm p-3 md:p-4 relative overflow-hidden transition-all duration-200 hover:border-[#4a4a4a] ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                {/* Priority Stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityColors[task.priority]}`} />

                {/* Stamp Overlay */}
                <AnimatePresence>
                  {stampedId === task.id && task.completed && (
                    <motion.div
                      initial={{ scale: 2, opacity: 0, rotate: -15 }}
                      animate={{ scale: 1, opacity: 1, rotate: -12 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    >
                      <div className="border-4 border-[#ff6b35] rounded-sm px-4 md:px-6 py-1 md:py-2 bg-[#1a1a1a]/80">
                        <span className="font-oswald text-xl md:text-2xl font-bold text-[#ff6b35] uppercase tracking-widest">
                          Complete
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 md:w-7 md:h-7 rounded-sm border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 min-w-[44px] min-h-[44px] ${
                      task.completed
                        ? 'bg-[#ff6b35] border-[#ff6b35]'
                        : 'border-[#5a5a5a] hover:border-[#ff6b35]'
                    }`}
                  >
                    {task.completed && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 md:w-4 md:h-4 text-[#1a1a1a]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`font-mono text-sm md:text-base transition-all duration-200 break-words ${
                      task.completed ? 'line-through text-[#6a6a6a]' : 'text-[#f5f0e6]'
                    }`}>
                      {task.text}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1 md:mt-2">
                      <span className={`text-[10px] md:text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm ${priorityColors[task.priority]} text-white`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] md:text-xs font-mono text-[#5a5a5a]">
                        ID: {task.id.slice(-6)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 text-[#5a5a5a] hover:text-red-500 transition-all duration-200 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    style={{ opacity: 'inherit' }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 md:py-16"
            >
              <div className="font-mono text-[#5a5a5a] text-sm uppercase tracking-widest">
                {filter === 'completed' ? 'No completed units' : filter === 'active' ? 'All units processed' : 'Production queue empty'}
              </div>
              <div className="font-oswald text-2xl md:text-3xl text-[#3a3a3a] mt-2 uppercase">Deploy new tasks</div>
            </motion.div>
          )}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 md:mt-12 grid grid-cols-3 gap-2 md:gap-4"
        >
          <StatCard label="Total Units" value={totalCount} />
          <StatCard label="In Queue" value={totalCount - completedCount} accent />
          <StatCard label="Processed" value={completedCount} />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/90 backdrop-blur-sm border-t border-[#2a2a2a] py-3 px-4">
        <p className="text-center font-mono text-[10px] md:text-xs text-[#4a4a4a] tracking-wide">
          Requested by <span className="text-[#6a6a6a]">@mxhllr</span> · Built by <span className="text-[#6a6a6a]">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

function GaugeDisplay({ percentage }: { percentage: number }) {
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <div className="relative w-20 h-12 md:w-28 md:h-16">
      {/* Gauge Background */}
      <div className="absolute bottom-0 left-0 right-0 h-10 md:h-14 overflow-hidden">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 md:border-[6px] border-[#3a3a3a] relative">
          {/* Colored Arc */}
          <div
            className="absolute inset-0 rounded-full border-4 md:border-[6px] border-transparent"
            style={{
              borderTopColor: '#ff6b35',
              borderRightColor: percentage > 50 ? '#ff6b35' : 'transparent',
              transform: `rotate(${45 + (percentage / 100) * 180}deg)`,
            }}
          />
          {/* Center Dot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-[#c49a6c] rounded-full" />
          {/* Needle */}
          <motion.div
            className="absolute bottom-0 left-1/2 origin-bottom w-0.5 h-6 md:h-9 bg-[#ff6b35]"
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            style={{ transformOrigin: 'bottom center', marginLeft: '-1px' }}
          />
        </div>
      </div>
      {/* Percentage Label */}
      <div className="absolute -bottom-4 md:-bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] md:text-xs text-[#c49a6c]">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`p-3 md:p-4 rounded-sm border ${accent ? 'bg-[#ff6b35]/10 border-[#ff6b35]/30' : 'bg-[#252525] border-[#3a3a3a]'}`}>
      <p className="font-mono text-[9px] md:text-[10px] text-[#6a6a6a] uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-oswald text-xl md:text-2xl lg:text-3xl font-bold ${accent ? 'text-[#ff6b35]' : 'text-[#c49a6c]'}`}>{value}</p>
    </div>
  );
}

export default App;
