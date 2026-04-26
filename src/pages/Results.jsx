import API_URL from "../config"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { answers, score, total, studentData } = location.state

  const percentage = Math.round((score / total) * 100)

  const getGrade = () => {
    if (percentage >= 90) return { label: "Excellent! 🏆", color: "text-yellow-400" }
    if (percentage >= 70) return { label: "Great Job! 🎯", color: "text-green-400" }
    if (percentage >= 50) return { label: "Good Effort! 👍", color: "text-blue-400" }
    return { label: "Keep Practicing! 💪", color: "text-red-400" }
  }

  const grade = getGrade()

  useEffect(() => {
    saveAttempt()
  }, [])

  const saveAttempt = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem("profile") || "null")
      await fetch(`${API_URL}/save-attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: studentData.name,
          age: parseInt(studentData.age),
          state: studentData.state,
          university: studentData.university,
          college: studentData.college,
          year: studentData.year,
          stream: studentData.stream,
          subject: studentData.subject,
          score,
          total,
          profile_id: profile?.id || null
        })
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-4 py-10">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Score Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6 text-center">

          <div className="text-6xl mb-4">
            {percentage >= 90 ? "🏆" : percentage >= 70 ? "🎯" : percentage >= 50 ? "👍" : "💪"}
          </div>

          <h1 className={`text-3xl font-bold mb-2 ${grade.color}`}>
            {grade.label}
          </h1>

          <p className="text-gray-400 mb-6">
            {studentData.name} • {studentData.subject} • {studentData.university}
          </p>

          {/* Score Circle */}
          <div className="flex items-center justify-center gap-12 mb-6">
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white">{score}/{total}</div>
              <div className="text-gray-400 text-sm mt-1">Score</div>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-center">
              <div className={`text-5xl font-extrabold ${grade.color}`}>{percentage}%</div>
              <div className="text-gray-400 text-sm mt-1">Percentage</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3 mb-2">
            <div
              className="h-3 rounded-full transition-all duration-1000 bg-gradient-to-r from-purple-500 to-indigo-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

        </div>

        {/* Answer Review */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">Answer Review</h2>

          <div className="space-y-4">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  a.isCorrect
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{a.isCorrect ? "✅" : "❌"}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-2">{a.question}</p>
                    <div className="flex gap-4 text-xs">
                      <span className="text-gray-400">
                        Your answer: <span className={a.isCorrect ? "text-green-400" : "text-red-400"}>{a.selected}</span>
                      </span>
                      {!a.isCorrect && (
                        <span className="text-gray-400">
                          Correct: <span className="text-green-400">{a.correct}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/student")}
            className="bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
          >
            Try Another Quiz
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Go Home 🏠
          </button>
        </div>

      </div>
    </div>
  )
}

export default Results