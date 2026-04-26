import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API_URL from "../config"

function Leaderboard() {
  const navigate = useNavigate()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const profile = JSON.parse(localStorage.getItem("profile") || "null")

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_URL}/leaderboard`)
      const data = await res.json()
      setLeaders(data.leaderboard)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const medals = ["🥇", "🥈", "🥉"]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white px-4 py-10">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-yellow-600 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-gray-400 mt-2">Top performers across all quizzes</p>
        </div>

        {/* Top 3 */}
        {leaders.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-10">

            {/* 2nd Place */}
            <div className="text-center">
              <div className="text-3xl mb-2">🥈</div>
              <div className="w-16 h-16 bg-gray-400/20 border-2 border-gray-400 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                {leaders[1]?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm font-semibold">{leaders[1]?.name}</div>
              <div className="text-gray-400 text-xs">{leaders[1]?.percentage}%</div>
              <div className="bg-gray-400/20 rounded-xl h-16 mt-2 w-20"></div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="text-4xl mb-2">🥇</div>
              <div className="w-20 h-20 bg-yellow-400/20 border-2 border-yellow-400 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-2">
                {leaders[0]?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm font-bold">{leaders[0]?.name}</div>
              <div className="text-yellow-400 text-xs font-bold">{leaders[0]?.percentage}%</div>
              <div className="bg-yellow-400/20 rounded-xl h-24 mt-2 w-20"></div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="text-3xl mb-2">🥉</div>
              <div className="w-16 h-16 bg-orange-400/20 border-2 border-orange-400 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                {leaders[2]?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm font-semibold">{leaders[2]?.name}</div>
              <div className="text-orange-400 text-xs">{leaders[2]?.percentage}%</div>
              <div className="bg-orange-400/20 rounded-xl h-10 mt-2 w-20"></div>
            </div>

          </div>
        )}

        {/* Full List */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-lg font-bold mb-4">All Rankings</h2>

          {leaders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-400">No data yet! Be the first!</p>
              <button
                onClick={() => navigate("/student")}
                className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Take a Quiz 🚀
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {leaders.map((leader, i) => {
                const isMe = profile?.id === leader.profile_id
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isMe
                        ? "bg-purple-500/20 border-purple-500/50"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="text-2xl w-8 text-center">
                      {i < 3 ? medals[i] : `#${i + 1}`}
                    </div>

                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                      {leader.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {leader.name}
                        {isMe && <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">You</span>}
                      </div>
                      <div className="text-gray-400 text-xs">{leader.attempts} quizzes taken</div>
                    </div>

                    <div className={`text-xl font-extrabold ${
                      leader.percentage >= 70 ? "text-green-400" :
                      leader.percentage >= 50 ? "text-yellow-400" :
                      "text-red-400"
                    }`}>
                      {leader.percentage}%
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* My Rank */}
        {profile && leaders.findIndex(l => l.profile_id === profile.id) !== -1 && (
          <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 text-center">
            <span className="text-purple-300">
              Your rank: #{leaders.findIndex(l => l.profile_id === profile.id) + 1} 🎯
            </span>
          </div>
        )}

      </div>
    </div>
  )
}

export default Leaderboard