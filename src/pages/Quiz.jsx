import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import API_URL from "../config"

const BATCH_SIZE = 2
const TOTAL_QUESTIONS = 10

function Quiz() {
  const location = useLocation()
  const navigate = useNavigate()
  const studentData = location.state

  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingNext, setLoadingNext] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState(studentData?.difficulty || "medium")
  const [batchAnswers, setBatchAnswers] = useState([])
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const timerRef = useRef(null)

 useEffect(() => {
    if (studentData.mode === "adaptive") {
      generateBatch(studentData.difficulty || "medium")
    } else {
      generateNormalQuiz()
    }
  }, [])

  useEffect(() => {
    if (timerActive && !selected) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive, current, selected])

  const generateNormalQuiz = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/generate-adaptive-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: studentData.university,
          stream: studentData.stream,
          year: studentData.year,
          subject: studentData.subject,
          difficulty: studentData.difficulty || "medium",
          count: 10,
          previous_questions: []
        })
      })
      const data = await res.json()
      setQuestions(data.questions)
      setCurrentDifficulty(studentData.difficulty || "medium")
      setTimerActive(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const generateBatch = async (difficulty) => {
    try {
      const previousQs = questions.map(q => q.question)
      
      const res = await fetch(`${API_URL}/generate-adaptive-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: studentData.subject,
          university: studentData.university,
          stream: studentData.stream,
          year: studentData.year,
          difficulty,
          count: BATCH_SIZE,
          previous_questions: previousQs
        })
      })
      const data = await res.json()
      setQuestions(prev => [...prev, ...data.questions])
      setCurrentDifficulty(difficulty)
      setBatchAnswers([])
      setTimerActive(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
    setLoadingNext(false)
  }

  const getNextDifficulty = (correctInBatch) => {
    if (correctInBatch === BATCH_SIZE) return "hard"
    if (correctInBatch === 1) return "medium"
    return "easy"
  }

  const handleTimeUp = () => {
    if (selected) return
    setSelected("__timeout__")
    setShowExplanation(true)
    setTimerActive(false)
    clearInterval(timerRef.current)
    setConsecutiveCorrect(0)
    setBatchAnswers(prev => [...prev, false])
  }

  const handleSelect = (option) => {
    if (selected) return
    clearInterval(timerRef.current)
    setTimerActive(false)
    setSelected(option)
    setShowExplanation(true)

    const isCorrect = option === questions[current].correct

    if (isCorrect) {
      setConsecutiveCorrect(prev => prev + 1)
    } else {
      setConsecutiveCorrect(0)
    }

    setBatchAnswers(prev => [...prev, isCorrect])
  }

  const handleNext = async () => {
    const isCorrect = selected !== "__timeout__" && selected === questions[current].correct

    const newAnswer = {
      question: questions[current].question,
      selected: selected === "__timeout__" ? "Time's up! ⏰" : selected,
      correct: questions[current].correct,
      isCorrect,
      difficulty: currentDifficulty,
      timedOut: selected === "__timeout__"
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    const nextIndex = current + 1
    const newBatchAnswers = [...batchAnswers]

    // Normal mode
    if (studentData.mode === "normal") {
      if (nextIndex >= questions.length) {
        const score = newAnswers.filter(a => a.isCorrect).length
        navigate("/results", {
          state: { answers: newAnswers, score, total: newAnswers.length, studentData }
        })
        return
      }
      setCurrent(nextIndex)
      setSelected(null)
      setShowExplanation(false)
      setTimeLeft(30)
      setTimerActive(true)
      return
    }

    // Adaptive mode - check if quiz is done
    if (newAnswers.length >= TOTAL_QUESTIONS) {
      const score = newAnswers.filter(a => a.isCorrect).length
      navigate("/results", {
        state: { answers: newAnswers, score, total: newAnswers.length, studentData }
      })
      return
    }

    // Check if current batch is complete
    if (newBatchAnswers.length >= BATCH_SIZE) {
      // Calculate correct in this batch
      const correctInBatch = newBatchAnswers.filter(Boolean).length
      const nextDiff = getNextDifficulty(correctInBatch)

      console.log(`Batch done! Correct: ${correctInBatch}/${BATCH_SIZE} → Next: ${nextDiff}`)

      setLoadingNext(true)
      setTimerActive(false)
      clearInterval(timerRef.current)
      setCurrent(nextIndex)
      setSelected(null)
      setShowExplanation(false)
      setTimeLeft(30)
      setBatchAnswers([])

      await generateBatch(nextDiff)
    } else {
      setCurrent(nextIndex)
      setSelected(null)
      setShowExplanation(false)
      setTimeLeft(30)
      setTimerActive(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-white text-xl font-semibold">Generating your quiz...</p>
        <p className="text-gray-400 mt-2">AI is preparing questions</p>
      </div>
    )
  }

  if (loadingNext) {
    const nextDiffLabel = currentDifficulty === "hard" ? "Hard 🔴" : currentDifficulty === "easy" ? "Easy 🟢" : "Medium 🟡"
    return (
      <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-white text-xl font-semibold">Adapting difficulty...</p>
        <p className="text-gray-400 mt-2">
          Switching to <span className={
            currentDifficulty === "hard" ? "text-red-400 font-bold" :
            currentDifficulty === "easy" ? "text-green-400 font-bold" :
            "text-yellow-400 font-bold"
          }>{nextDiffLabel}</span> based on your performance
        </p>
        <div className="mt-6 flex gap-2">
          {Array.from({ length: BATCH_SIZE }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${
              batchAnswers[i] === true ? "bg-green-400" :
              batchAnswers[i] === false ? "bg-red-400" :
              "bg-white/20"
            }`}></div>
          ))}
        </div>
      </div>
    )
  }

  if (!questions.length || current >= questions.length) return null

  const q = questions[current]
  const progress = (answers.length / TOTAL_QUESTIONS) * 100

  const timerColor = timeLeft > 15
    ? "text-green-400 border-green-400"
    : timeLeft > 5
    ? "text-yellow-400 border-yellow-400"
    : "text-red-400 border-red-400 animate-pulse"

  const timerBg = timeLeft > 15 ? "bg-green-400" : timeLeft > 5 ? "bg-yellow-400" : "bg-red-400"

  const difficultyColors = {
    easy: "text-green-400 bg-green-400/10 border-green-400/30",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    hard: "text-red-400 bg-red-400/10 border-red-400/30"
  }

  const diffEmoji = { easy: "🟢", medium: "🟡", hard: "🔴" }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-4 py-8">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-gray-400 text-sm">{studentData.subject}</div>
            <div className="font-bold">{studentData.university} • {studentData.year}</div>
          </div>
          <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-extrabold text-2xl ${timerColor}`}>
            {timeLeft}
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
          <div
            className={`h-1.5 rounded-full transition-all duration-1000 ${timerBg}`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          ></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="text-gray-400 text-sm">
            Question <span className="text-white font-bold">{answers.length + 1}</span> / {TOTAL_QUESTIONS}
          </div>

          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[currentDifficulty]}`}>
            {diffEmoji[currentDifficulty]} {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)} Mode
          </div>

          {consecutiveCorrect >= 2 && (
            <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs px-3 py-1 rounded-full">
              🔥 {consecutiveCorrect} streak!
            </div>
          )}
        </div>

        {/* Batch Progress Dots */}
        {studentData.mode === "adaptive" && (
          <div className="flex gap-2 mb-4">
            {Array.from({ length: BATCH_SIZE }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  batchAnswers[i] === true ? "bg-green-400" :
                  batchAnswers[i] === false ? "bg-red-400" :
                  i === batchAnswers.length ? "bg-purple-500 animate-pulse" :
                  "bg-white/10"
                }`}
              ></div>
            ))}
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">

          <h2 className="text-xl font-semibold leading-relaxed mb-8">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((option, i) => {
              let style = "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50 hover:bg-white/10"
              if (selected) {
                if (option === q.correct) style = "bg-green-500/20 border-green-500 text-green-300"
                else if (option === selected && option !== q.correct) style = "bg-red-500/20 border-red-500 text-red-300"
                else style = "bg-white/5 border-white/10 text-gray-500"
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

          {selected === "__timeout__" && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="text-red-400 text-sm font-semibold mb-1">⏰ Time's Up!</div>
              <div className="text-gray-300 text-sm">Correct answer: <span className="text-green-400 font-semibold">{q.correct}</span></div>
            </div>
          )}

          {showExplanation && selected !== "__timeout__" && (
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="text-blue-400 text-sm font-semibold mb-1">💡 Explanation</div>
              <div className="text-gray-300 text-sm">{q.explanation}</div>
            </div>
          )}
        </div>

        {selected && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
          >
            {answers.length + 1 >= TOTAL_QUESTIONS ? "See Results 🎯" : "Next Question →"}
          </button>
        )}

      </div>
    </div>
  )
}

export default Quiz