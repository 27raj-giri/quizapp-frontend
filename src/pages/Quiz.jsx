import API_URL from "../config"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function Quiz() {
  const location = useLocation()
  const navigate = useNavigate()
  const studentData = location.state

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    generateQuiz()
  }, [])

  const generateQuiz = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/generate-student-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: studentData.university,
          stream: studentData.stream,
          year: studentData.year,
          subject: studentData.subject,
          numQuestions: 10
        })
      })
      const data = await res.json()
      setQuestions(data.questions)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleSelect = (option) => {
    if (selected) return
    setSelected(option)
    setShowExplanation(true)
  }

  const handleNext = () => {
    const isCorrect = selected === questions[current].correct
    const newAnswers = [...answers, {
      question: questions[current].question,
      selected,
      correct: questions[current].correct,
      isCorrect
    }]
    setAnswers(newAnswers)

    if (current + 1 < questions.length) {
      setCurrent(current + 1)
      setSelected(null)
      setShowExplanation(false)
    } else {
      const score = newAnswers.filter(a => a.isCorrect).length
      navigate("/results", {
        state: {
          answers: newAnswers,
          score,
          total: questions.length,
          studentData
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-white text-xl font-semibold">Generating your quiz...</p>
        <p className="text-gray-400 mt-2">Gemini AI is preparing questions</p>
      </div>
    )
  }

  if (!questions.length) return null

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  const diffColor = {
    easy: "text-green-400 bg-green-400/10 border-green-400/30",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    hard: "text-red-400 bg-red-400/10 border-red-400/30"
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-4 py-8">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-gray-400 text-sm">{studentData.subject}</div>
            <div className="font-bold text-lg">{studentData.university} • {studentData.year}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Question</div>
            <div className="font-bold text-lg">{current + 1} / {questions.length}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">

          {/* Difficulty badge */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${diffColor[q.difficulty] || diffColor.medium}`}>
            {q.difficulty === "easy" ? "🟢" : q.difficulty === "hard" ? "🔴" : "🟡"}
            {q.difficulty?.charAt(0).toUpperCase() + q.difficulty?.slice(1)}
          </div>

          <h2 className="text-xl font-semibold leading-relaxed mb-8">
            {q.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((option, i) => {
              let style = "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50 hover:bg-white/10"

              if (selected) {
                if (option === q.correct) {
                  style = "bg-green-500/20 border-green-500 text-green-300"
                } else if (option === selected && option !== q.correct) {
                  style = "bg-red-500/20 border-red-500 text-red-300"
                } else {
                  style = "bg-white/5 border-white/10 text-gray-500"
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center gap-3 ${style}`}
                >
                  <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="text-blue-400 text-sm font-semibold mb-1">💡 Explanation</div>
              <div className="text-gray-300 text-sm">{q.explanation}</div>
            </div>
          )}
        </div>

        {/* Next Button */}
        {selected && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
          >
            {current + 1 === questions.length ? "See Results 🎯" : "Next Question →"}
          </button>
        )}

      </div>
    </div>
  )
}

export default Quiz