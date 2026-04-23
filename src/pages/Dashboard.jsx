import API_URL from "../config"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

function Dashboard() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/teacher-dashboard/${code}`)
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data || data.error) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
        <div className="text-white text-xl">Quiz not found!</div>
      </div>
    )
  }

  const attempts = data.attempts || []
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((a, b) => a + (b.score / b.total) * 100, 0) / attempts.length)
    : 0
  const topScore = attempts.length
    ? Math.max(...attempts.map(a => Math.round((a.score / a.total) * 100)))
    : 0

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-4 py-10">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-rose-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
              <p className="text-gray-400">{data.quiz.topic} • <span className="capitalize">{data.quiz.difficulty}</span></p>
            </div>
            <div className="bg-pink-500/20 border border-pink-500/30 rounded-2xl px-6 py-3 text-center">
              <div className="text-2xl font-extrabold tracking-widest text-white">{code}</div>
              <div className="text-gray-400 text-xs">Share Code</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-pink-400">{attempts.length}</div>
              <div className="text-gray-400 text-sm mt-1">Total Attempts</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-pink-400">{avgScore}%</div>
              <div className="text-gray-400 text-sm mt-1">Average Score</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-pink-400">{topScore}%</div>
              <div className="text-gray-400 text-sm mt-1">Top Score</div>
            </div>
          </div>
        </div>

        {/* Attempts List */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">
            Student Attempts ({attempts.length})
          </h2>

          {attempts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">👀</div>
              <p className="text-gray-400">No attempts yet!</p>
              <p className="text-gray-500 text-sm mt-1">Share code <span className="text-white font-bold">{code}</span> with students</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.map((attempt, i) => {
                const pct = Math.round((attempt.score / attempt.total) * 100)
                return (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center font-bold">
                        {attempt.student_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{attempt.student_name}</div>
                        <div className="text-gray-400 text-xs">
                          {new Date(attempt.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{attempt.score}/{attempt.total}</div>
                        <div className="text-gray-400 text-xs">Score</div>
                      </div>
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-lg ${
                        pct >= 70 ? "bg-green-500/20 text-green-400" :
                        pct >= 50 ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {pct}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Refresh */}
        <button
          onClick={fetchDashboard}
          className="w-full mt-4 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
        >
          🔄 Refresh
        </button>

      </div>
    </div>
  )
}

export default Dashboard