import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API_URL from "../config"

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill all fields!")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || "Something went wrong!")
      } else {
        localStorage.setItem("profile", JSON.stringify(data.profile))
        navigate("/profile")
      }
    } catch (err) {
      setError("Something went wrong!")
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
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          ← Back to Home
        </button>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
              🔐
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome Back!</h1>
              <p className="text-gray-400 text-sm">Login to your profile</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              {loading ? "Logging in..." : "Login 🚀"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Don't have account?{" "}
              <span onClick={() => navigate("/signup")} className="text-purple-400 cursor-pointer hover:underline">
                Create Profile
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login