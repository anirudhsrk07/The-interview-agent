import "./App.css";

function App() {
  return (
    <div className="app">
      <h1> The Interview Agent </h1>

      <p>
        Practice AI-powered mock interviews and receive instant feedback.
      </p>

      <input
        type="text"
        placeholder="Enter Job Role (e.g. Software Engineer)"
      />

      <select>
        <option>Fresher</option>
        <option>1-2 Years</option>
        <option>3-5 Years</option>
        <option>5+ Years</option>
      </select>

      <button>Start Interview</button>
    </div>
  );
}

export default App; 