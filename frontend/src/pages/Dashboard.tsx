import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

type Mode = "work" | "break";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("work");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (!isRunning || timerRef.current) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current!);
      timerRef.current = null;
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => {
    setIsRunning(false);
    clearInterval(timerRef.current!);
    timerRef.current = null;
  };
  const reset = () => {
    pause();
    setSecondsLeft(mode === "work" ? WORK_DURATION : BREAK_DURATION);
  };

  const switchMode = () => {
    const nextMode = mode === "work" ? "break" : "work";
    setMode(nextMode);
    setSecondsLeft(nextMode === "work" ? WORK_DURATION : BREAK_DURATION);
  };

  const handleSessionComplete = async () => {
    setIsRunning(false);
    try {
      await axios.post("/sessions", { mode });
    } catch (err) {
      console.error("Failed to log session", err);
    }
    switchMode();
  };

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  // Task logic
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post("/tasks", { title: newTask });
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const res = await axios.patch(`/tasks/${id}`, { completed: !completed });
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );
    } catch (err) {
      console.error("Error toggling task", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-primary-800 text-center">
          Pomodoro Focus
        </h2>

        {/* Timer Section */}
        <div
          className={`mb-8 text-center p-6 rounded-lg ${
            mode === "work" ? "bg-primary-100" : "bg-secondary-100"
          }`}
        >
          <h1 className="text-2xl font-semibold mb-4 text-primary-800">
            {mode === "work" ? "Focus Time 🧠" : "Break Time ☕"}
          </h1>
          <div
            className={`text-7xl font-mono mb-6 font-bold ${
              mode === "work" ? "text-primary-600" : "text-secondary-600"
            }`}
          >
            {formatTime(secondsLeft)}
          </div>
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <button
                onClick={start}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-md"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pause}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-md"
              >
                Pause
              </button>
            )}
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors shadow-md"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Task Input */}
        <div className="flex space-x-3 mb-8">
          <input
            type="text"
            placeholder="What are you working on?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="flex-1 border border-[#99f6e4] focus:border-[#14b8a6] focus:ring-2 focus:ring-[#99f6e4] rounded-lg px-4 py-2 outline-none transition-all"
          />
          <button
            onClick={addTask}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-primary-800">
            Your Tasks
          </h3>
          {tasks.length === 0 ? (
            <p className="text-gray-500 italic">No tasks yet. Add one above!</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between bg-white border border-primary-100 hover:border-primary-200 p-4 rounded-lg transition-all shadow-sm"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => toggleComplete(task._id, task.completed)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        task.completed
                          ? "bg-primary-500 border-primary-500"
                          : "border-primary-300"
                      }`}
                    >
                      {task.completed && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-primary-800"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-gray-400 hover:text-accent-500 transition-colors p-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
