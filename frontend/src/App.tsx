import { Outlet } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import "./App.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <Outlet /> {/* Render nested routes here */}
      </main>
    </div>
  );
};

export default App;
