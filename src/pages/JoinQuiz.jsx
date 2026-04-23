import API_URL from "../config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function JoinQuiz() {
  const navigate = useNavigate()
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!code || !name) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/quiz/${code.toUpperCase()}`)
      const data = await res.json()
      if (data.error) {
        setError("Invalid code! Please check and try again.")
      } else {
        navigate("/shared-quiz", {
          state: {
            quiz: data,
            studentName: name
          }
        })
      }
    } catch (err) {
      setError("Something went wrong. Try again!")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white flex items-center justify-center px-4">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to Home
        </button>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔑</div>
            <h1 className="text-2xl font-bold">Join a Quiz</h1>
            <p className="text-gray-400 mt-1">Enter the code your teacher shared</p>
          </div>

          <div className="space-y-4">

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Quiz Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-center text-2xl font-bold tracking-widest uppercase"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={!code || !name || loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                code && name && !loading
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/30"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Joining..." : "Join Quiz 🚀"}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinQuiz