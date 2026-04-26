import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API_URL from "../config"

function Profile() {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  const profile = JSON.parse(localStorage.getItem("profile") || "null")

  useEffect(() => {
    if (!profile) {
      navigate("/login")
      return
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile/${profile.id}`)
      const data = await res.json()
      setProfileData(data.profile)
      setAttempts(data.attempts)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("profile")
    navigate("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalScore = attempts.reduce((a, b) => a + b.score, 0)
  const totalQuestions = attempts.reduce((a, b) => a + b.total, 0)
  const avgPercentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => Math.round((a.score / a.total) * 100))) : 0

  const subjectStats = {}
  attempts.forEach(a => {
    if (!subjectStats[a.subject]) {
      subjectStats[a.subject] = { score: 0, total: 0, count: 0 }
    }
    subjectStats[a.subject].score += a.score
    subjectStats[a.subject].total += a.total
    subjectStats[a.subject].count += 1
  })

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-4 py-10">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            ← Home
          </button>
          <button onClick={handleLogout} className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition-all">
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl font-bold">
              {profileData?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profileData?.name}</h1>
              <p className="text-gray-400">{profileData?.email}</p>
              <div className="flex gap-3 mt-2 flex-wrap">
                <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                  {profileData?.university}
                </span>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                  {profileData?.stream}
                </span>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                  {profileData?.year}
                </span>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">
                  {profileData?.college}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{attempts.length}</div>
            <div className="text-gray-400 text-sm mt-1">Quizzes Taken</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{avgPercentage}%</div>
            <div className="text-gray-400 text-sm mt-1">Avg Score</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{bestScore}%</div>
            <div className="text-gray-400 text-sm mt-1">Best Score</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{totalQuestions}</div>
            <div className="text-gray-400 text-sm mt-1">Questions Done</div>
          </div>
        </div>

        {/* Subject Performance */}
        {Object.keys(subjectStats).length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
            <h2 className="text-xl font-bold mb-6">Subject Performance</h2>
            <div className="space-y-4">
              {Object.entries(subjectStats).map(([subject, stats]) => {
                const pct = Math.round((stats.score / stats.total) * 100)
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 font-medium">{subject}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">{stats.count} attempts</span>
                        <span className={`font-bold ${pct >= 70 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${pct >= 70 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quiz History */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Quiz History</h2>

          {attempts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-400">No quizzes taken yet!</p>
              <button
                onClick={() => navigate("/student")}
                className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
              >
                Take a Quiz 🚀
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.map((attempt, i) => {
                const pct = Math.round((attempt.score / attempt.total) * 100)
                return (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{attempt.subject}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {attempt.university} • {attempt.year} • {new Date(attempt.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{attempt.score}/{attempt.total}</div>
                        <div className="text-gray-400 text-xs">Score</div>
                      </div>
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-extrabold ${
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => navigate("/student")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Take Quiz 🚀
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
          >
            Leaderboard 🏆
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile