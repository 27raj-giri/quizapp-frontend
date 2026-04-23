import { useState } from "react"
import { useNavigate } from "react-router-dom"

function TeacherForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    topic: "",
    difficulty: "",
    numQuestions: 10
  })

  const difficulties = [
    { id: "easy", label: "Easy", emoji: "🟢", desc: "Basic concepts" },
    { id: "medium", label: "Medium", emoji: "🟡", desc: "Moderate level" },
    { id: "hard", label: "Hard", emoji: "🔴", desc: "Advanced level" },
    { id: "mix", label: "Mix", emoji: "🎯", desc: "All levels" },
  ]

  const questionOptions = [5, 10, 15, 20]

  const handleSubmit = () => {
    navigate("/teacher-quiz", { state: formData })
  }

  const isReady = formData.topic && formData.difficulty

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white flex items-center justify-center px-4 py-10">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-rose-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to Home
        </button>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create a Quiz</h1>
              <p className="text-gray-400 text-sm">Set topic and share with students</p>
            </div>
          </div>

          <div className="space-y-6">

            {/* Topic */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Topic or Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Data Structures, Newton's Laws..."
                value={formData.topic}
                onChange={e => setFormData({...formData, topic: e.target.value})}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-gray-400 text-sm mb-3 block">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {difficulties.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setFormData({...formData, difficulty: d.id})}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl border transition-all ${
                      formData.difficulty === d.id
                        ? "bg-pink-500/20 border-pink-500 text-white"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-pink-500/50"
                    }`}
                  >
                    <span className="text-xl">{d.emoji}</span>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{d.label}</div>
                      <div className="text-xs text-gray-400">{d.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="text-gray-400 text-sm mb-3 block">
                Number of Questions
              </label>
              <div className="flex gap-3">
                {questionOptions.map(n => (
                  <button
                    key={n}
                    onClick={() => setFormData({...formData, numQuestions: n})}
                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${
                      formData.numQuestions === n
                        ? "bg-pink-500/20 border-pink-500 text-white"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-pink-500/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {isReady && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-gray-400 text-xs mb-2">Quiz Preview</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{formData.topic}</div>
                    <div className="text-gray-400 text-sm capitalize">
                      {formData.difficulty} • {formData.numQuestions} questions
                    </div>
                  </div>
                  <div className="text-2xl">
                    {difficulties.find(d => d.id === formData.difficulty)?.emoji}
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isReady}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isReady
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:opacity-90 shadow-lg shadow-pink-500/30"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              Generate Quiz 🚀
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherForm