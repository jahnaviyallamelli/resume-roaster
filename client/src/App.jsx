import { useState } from "react";
import jsPDF from "jspdf";

function App() {
  const [roast, setRoast] = useState("");
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("hr");
  const [level, setLevel] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] =
  useState("Analyzing resume...");


  const loadingMessages = [
    "Analyzing resume...",
    "Judging career choices...",
    "Comparing with Sharma Ji's son...",
    "Generating emotional damage...",
    "Calling FAANG recruiters...",
    "Checking tutorial dependency...",
  ];

  function downloadRoast() {
    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.width;

    const pageHeight =
      doc.internal.pageSize.height;

    const margin = 10;

    const maxLineWidth =
      pageWidth - margin * 2;

    const cleanRoast = roast.replace(
      /[\u{1F300}-\u{1FAFF}]/gu,
    ""
    );

    const splitText =
      doc.splitTextToSize(
        cleanRoast,
        maxLineWidth
      );

    let y = 20;

    doc.setFontSize(20);
    doc.text("AI Resume Roast ", 10, 10);

    doc.setFontSize(12);

    splitText.forEach((line) => {

      if (y > pageHeight - 10) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, margin, y);

      y += 7;
    });

    doc.save("resume-roast.pdf");
  }
    
  async function handleRoast() {
    try {
      setLoading(true);

      let index = 0;

      const interval = setInterval(() => {
        setLoadingText(
          loadingMessages[
            index % loadingMessages.length
          ]
        );

        index++;
      }, 1200);

      const formData = new FormData();

      formData.append("resume", file);
      formData.append("mode", mode);
      formData.append("level", level);

      const response = await fetch(
        "http://localhost:5000/roast",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      clearInterval(interval);

      setRoast(data.roast);

      // TEXT TO SPEECH
      const speech =
        new SpeechSynthesisUtterance(
          data.roast
        );

      speech.rate = 1;
      speech.pitch = 1;

      window.speechSynthesis.speak(speech);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
    
    <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
      
      <h1 className="text-5xl font-bold text-center mb-2">
        AI Resume Roaster 🔥
      </h1>

      <p className="text-zinc-400 text-center mb-10">
        Upload your resume and prepare for emotional damage.
      </p>

      <div className="flex flex-col gap-6">

        {/* FILE INPUT */}
        <div>
          <label className="block mb-2 text-sm text-zinc-400">
            Upload Resume
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
          />
        </div>

        {/* SELECTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              Roast Mode
            </label>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            >
              <option value="hr">HR Reviewer</option>
              <option value="bestfriend">Best Friend</option>
              <option value="recruiter">FAANG Recruiter</option>
              <option value="savage">Savage Roaster</option>
              <option value="genz">Gen Z Mode</option>
              <option value="indianuncle">Indian Uncle</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-400">
              Roast Level
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            >
              <option value="low">Low 🔹</option>
              <option value="medium">Medium 🔥</option>
              <option value="hard">Hard ☠️</option>
            </select>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleRoast}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 transition-all duration-300 rounded-xl py-4 text-lg font-semibold"
        >
          {loading ? loadingText : "Roast Me 🔥"}
        </button>

        {/* RESULT */}
        {roast && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mt-4">
            
            <h2 className="text-2xl font-bold mb-4">
              Roast Result ☠️
            </h2>

            <p className="text-zinc-300 leading-8 whitespace-pre-wrap">
              {roast}
            </p>

            <button
              onClick={downloadRoast}
              className="mt-6 bg-white text-black px-5 py-3 rounded-xl font-semibold hover:scale-105 transition-all"
            >
              Download Roast PDF
            </button>
          </div>
        )}

      </div>
    </div>
  </div>
);
}

export default App;