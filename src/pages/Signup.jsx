import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API_URL from "../config"

const universityData = {
  "Madhya Pradesh": { university: "RGPV", streams: ["Computer Science", "Mechanical", "Civil", "MBBS", "BDS"] },
  "Uttar Pradesh": { university: "AKTU", streams: ["Computer Science", "Mechanical", "Civil", "MBBS", "BDS"] },
  "Maharashtra": { university: "Mumbai University", streams: ["Computer Science", "Mechanical", "Civil", "MBBS", "BDS"] },
  "Rajasthan": { university: "RTU", streams: ["Computer Science", "Mechanical", "Civil", "MBBS", "BDS"] },
  "Gujarat": { university: "GTU", streams: ["Computer Science", "Mechanical", "Civil", "MBBS", "BDS"] },
  "Karnataka": { university: "VTU", streams: ["Computer Science", "Mechanical", "Civil", "MBBS", "BDS"] },
  "Tamil Nadu": { university: "Anna University", streams: ["Computer Science", "Mechanical", "Civil", "MBBS", "BDS"] },
  "Delhi": { university: "IPU", streams: ["Computer Science", "Mechanical", "Civil", "MBBS", "BDS"] },
}

function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    college: "", state: "", university: "", stream: "", year: ""
  })

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      if (field === "state") {
        updated.university = universityData[value]?.university || ""
        updated.stream = ""
      }
      return updated
    })
  }

  const handleNext = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all fields!")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      return
    }
    setError("")
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!formData.college || !formData.state || !formData.stream || !formData.year) {
      setError("Please fill all fields!")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/signup`, {
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

  const inputClass = "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
  const selectClass = "w-full bg-[#1a1a2e] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white flex items-center justify-center px-4 py-10">
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
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create Profile</h1>
              <p className="text-gray-400 text-sm">Step {step} of 2</p>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full bg-white/10 rounded-full h-1.5 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all" style={{ width: step === 1 ? "50%" : "100%" }}></div>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                <input type="text" placeholder="Your name" value={formData.name} onChange={e => handleChange("name", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Email</label>
                <input type="email" placeholder="your@email.com" value={formData.email} onChange={e => handleChange("email", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Password</label>
                <input type="password" placeholder="Create password" value={formData.password} onChange={e => handleChange("password", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Confirm Password</label>
                <input type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={e => handleChange("confirmPassword", e.target.value)} className={inputClass} />
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

              <button onClick={handleNext} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all">
                Next →
              </button>

              <p className="text-center text-gray-400 text-sm">
                Already have account?{" "}
                <span onClick={() => navigate("/login")} className="text-purple-400 cursor-pointer hover:underline">Login</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">College Name</label>
                <input type="text" placeholder="Your college" value={formData.college} onChange={e => handleChange("college", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">State</label>
                <select value={formData.state} onChange={e => handleChange("state", e.target.value)} className={selectClass}>
                  <option value="">Select state</option>
                  {Object.keys(universityData).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {formData.university && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-300 font-medium">
                  ✓ {formData.university}
                </div>
              )}
              {formData.state && (
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Stream</label>
                  <select value={formData.stream} onChange={e => handleChange("stream", e.target.value)} className={selectClass}>
                    <option value="">Select stream</option>
                    {universityData[formData.state]?.streams.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              {formData.stream && (
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Year</label>
                  <select value={formData.year} onChange={e => handleChange("year", e.target.value)} className={selectClass}>
                    <option value="">Select year</option>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              )}

              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setStep(1)} className="bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all">
                  {loading ? "Creating..." : "Create Profile 🚀"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup