import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [shortlisted, setShortlisted] = useState([]);

  // Add Candidate
  const addCandidate = async () => {
    try {
      await axios.post(
        "https://candidate-shortlisting-system-p7t8.onrender.com/api/candidates",
        {
          name,
          skills: skills.split(","),
          experience,
        }
      );

      setName("");
      setSkills("");
      setExperience("");

      alert("Candidate Added Successfully");
    } catch (error) {
      console.log(error);
      alert("Error adding candidate");
    }
  };

  // AI Shortlist
  const aiShortlist = async () => {
    try {
      const res = await axios.post(
        "https://candidate-shortlisting-system-p7t8.onrender.com/api/ai/shortlist"
      );

      setShortlisted(res.data.shortlisted);
    } catch (error) {
      console.log(error);
      alert("Error shortlisting candidates");
    }
  };

  return (
    <div className="container">
      <h1>AI Candidate Shortlisting</h1>

      <div className="form-box">
        <input
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Skills (React, Node.js, MongoDB)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          type="number"
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <div className="button-group">
          <button onClick={addCandidate}>
            Add Candidate
          </button>

          <button onClick={aiShortlist}>
            AI Shortlist
          </button>
        </div>
      </div>

      <div className="results">
        {shortlisted.map((candidate, index) => (
          <div className="card" key={index}>
            <h2>{candidate.name}</h2>

            <p>
              <strong>Skills:</strong> {candidate.skills.join(", ")}
            </p>

            <p>
              <strong>Experience:</strong> {candidate.experience} years
            </p>

            <p className="score">
              AI Score: {candidate.score}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;