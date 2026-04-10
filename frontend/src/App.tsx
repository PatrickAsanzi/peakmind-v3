import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.5",
        padding: "2rem",
      }}
    >
      <h1>mvp-template</h1>
      <p>
        This is a reusable monorepo starter with .NET 8 backend and Vite + React
        + TypeScript frontend.
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ padding: "0.75rem 1rem", marginTop: "1rem" }}
      >
        count is {count}
      </button>
    </div>
  );
}

export default App;
