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
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">Pomodoro Task Tracker</h2>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {mode === "work" ? "Focus Time 🧠" : "Break Time ☕"}
        </h1>
        <div className="text-6xl font-mono mb-4">{formatTime(secondsLeft)}</div>
        <div className="space-x-2">
          {!isRunning ? (
            <button
              onClick={start}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Pause
            </button>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span
              className={`flex-1 ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => toggleComplete(task._id, task.completed)}
              className="text-sm text-green-600"
            >
              {task.completed ? "Undo" : "Done"}
            </button>
            <button
              onClick={() => deleteTask(task._id)}
              className="text-sm text-red-600 ml-4"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
