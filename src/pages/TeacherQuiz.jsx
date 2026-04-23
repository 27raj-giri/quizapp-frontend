import API_URL from "../config"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function TeacherQuiz() {
  const location = useLocation()
  const navigate = useNavigate()
  const teacherData = location.state

  const [questions, setQuestions] = useState([])
  const [shareCode, setShareCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    generateQuiz()
  }, [])

  const generateQuiz = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/generate-teacher-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: teacherData.topic,
          difficulty: teacherData.difficulty,
          numQuestions: teacherData.numQuestions
        })
      })
      const data = await res.json()
      console.log("API Response:", data)
      setQuestions(data.questions)
      setShareCode(data.share_code)
    } catch (err) {
      console.error("Error:", err)
    }
    setLoading(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(shareCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${shareCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-white text-xl font-semibold">Generating quiz...</p>
        <p className="text-gray-400 mt-2">AI is preparing {teacherData.numQuestions} questions on {teacherData.topic}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-4 py-10">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-rose-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/teacher")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back
        </button>

        {/* Share Code Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">

          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🎉</div>
            <h1 className="text-2xl font-bold mb-1">Quiz Created!</h1>
            <p className="text-gray-400">Share this code with your students</p>
          </div>

          {/* Big Code Display */}
          <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-2xl p-6 text-center mb-6">
            <div className="text-gray-400 text-sm mb-2">Share Code</div>
            <div className="text-6xl font-extrabold tracking-widest text-white mb-4">
              {shareCode}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={copyCode}
                className="bg-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-pink-700 transition-colors"
              >
                {copied ? "Copied! ✓" : "Copy Code"}
              </button>
              <button
                onClick={copyLink}
                className="bg-white/10 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Quiz Info */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">{questions.length}</div>
              <div className="text-gray-400 text-xs mt-1">Questions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-400 capitalize">{teacherData.difficulty}</div>
              <div className="text-gray-400 text-xs mt-1">Difficulty</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">MCQ</div>
              <div className="text-gray-400 text-xs mt-1">Type</div>
            </div>
          </div>

          {/* Dashboard Button */}
          <button
            onClick={() => navigate(`/dashboard/${shareCode}`)}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            View Dashboard 📊
          </button>

        </div>

        {/* Questions Preview */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">
            Questions Preview
          </h2>

          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-pink-500/20 text-pink-400 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 mb-2">{q.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, j) => (
                        <div
                          key={j}
                          className={`text-xs px-3 py-2 rounded-lg ${
                            opt === q.correct
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-white/5 text-gray-400"
                          }`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default TeacherQuiz