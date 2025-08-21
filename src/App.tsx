import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-50 p-6">
      {/* Logos */}
      <div className="flex space-x-6">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="h-16 w-16 hover:scale-110 transition"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="h-16 w-16 hover:scale-110 transition"
            alt="React logo"
          />
        </a>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-red-600">
        Vite + React + Tailwind
      </h1>

      {/* Buttons with different colors */}
      <div className="flex flex-wrap gap-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
          Red Button
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
          Green Button
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Blue Button
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg shadow hover:bg-yellow-600">
          Yellow Button
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600">
          Purple Button
        </button>
      </div>

      {/* Counter */}
      <div className="mt-6 bg-white shadow-xl rounded-xl p-6 w-64 text-center">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="w-full px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
        >
          Count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit <code className="bg-gray-200 px-1 rounded">src/App.tsx</code> and
          save to test HMR
        </p>
      </div>

      {/* Footer text */}
      <p className="text-sm text-pink-500 font-medium">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
