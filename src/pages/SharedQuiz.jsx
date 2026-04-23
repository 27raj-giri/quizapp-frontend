import API_URL from "../config"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function SharedQuiz() {
  const location = useLocation()
  const navigate = useNavigate()
  const { quiz, studentName } = location.state

  const questions = quiz.questions
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

  const handleSelect = (option) => {
    if (selected) return
    setSelected(option)
    setShowExplanation(true)
  }

  const handleNext = async () => {
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
      const finalScore = newAnswers.filter(a => a.isCorrect).length
      setScore(finalScore)
      setFinished(true)

      try {
        await fetch(`${API_URL}/save-shared-attempt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz_id: quiz.id,
            student_name: studentName,
            score: finalScore,
            total: questions.length,
            answers: newAnswers
          })
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen bg-[#0f0c29] text-white flex items-center justify-center px-4">
        <div className="relative z-10 w-full max-w-md text-center">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="text-6xl mb-4">
              {percentage >= 70 ? "🏆" : percentage >= 50 ? "👍" : "💪"}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {percentage >= 70 ? "Great Job!" : percentage >= 50 ? "Good Effort!" : "Keep Practicing!"}
            </h1>
            <p className="text-gray-400 mb-6">{studentName}</p>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <div className="text-4xl font-extrabold">{score}/{questions.length}</div>
                <div className="text-gray-400 text-sm">Score</div>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <div className="text-4xl font-extrabold text-purple-400">{percentage}%</div>
                <div className="text-gray-400 text-sm">Percentage</div>
              </div>
            </div>

            <div className="w-full bg-white/10 rounded-full h-3 mb-8">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Go Home 🏠
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const progress = (current / questions.length) * 100

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-4 py-8">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-gray-400 text-sm">{quiz.topic}</div>
            <div className="font-bold text-lg capitalize">{quiz.difficulty} Level</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Question</div>
            <div className="font-bold text-lg">{current + 1} / {questions.length}</div>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-2 mb-8">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">

          <h2 className="text-xl font-semibold leading-relaxed mb-8">
            {q.question}
          </h2>

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

          {showExplanation && (
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="text-blue-400 text-sm font-semibold mb-1">💡 Explanation</div>
              <div className="text-gray-300 text-sm">{q.explanation}</div>
            </div>
          )}
        </div>

        {selected && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
          >
            {current + 1 === questions.length ? "See Results 🎯" : "Next Question →"}
          </button>
        )}

      </div>
    </div>
  )
}

export default SharedQuiz