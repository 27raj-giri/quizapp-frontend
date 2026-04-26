import { useNavigate } from "react-router-dom"

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white overflow-hidden">

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Navbar */}
          {/* Navbar */}
<nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-sm">
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-lg">
      🧠
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
      QuizAI
    </span>
  </div>
  <div className="flex items-center gap-3">
    {JSON.parse(localStorage.getItem("profile")) ? (
      <>
        <button
          onClick={() => navigate("/leaderboard")}
          className="text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
        >
          🏆 Leaderboard
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
            {JSON.parse(localStorage.getItem("profile"))?.name?.charAt(0).toUpperCase()}
          </span>
          My Profile
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => navigate("/login")}
          className="text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          Sign Up
        </button>
      </>
    )}
  </div>
</nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-10">

        {/* Badge */}
        <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-5 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-purple-300 text-sm font-medium">
            AI Quiz Generator — Live
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-extrabold text-center leading-tight mb-6 max-w-3xl">
          Learn Smarter with
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            AI Powered Quizzes
          </span>
        </h1>

        <p className="text-gray-400 text-center text-lg max-w-lg mb-16 leading-relaxed">
          Quizzes tailored to your university syllabus. 
          Students grow faster. Teachers track smarter.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-20">

          {/* Student Card */}
          <div
            onClick={() => navigate("/student")}
            className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 cursor-pointer hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full filter blur-2xl group-hover:bg-purple-600/30 transition-all"></div>
            
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-purple-500/30">
              🎓
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              I'm a Student
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Get quizzes based on your university, year, stream and subject. Track your progress with detailed analytics.
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">Adaptive</span>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30">Analytics</span>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/30">
                Start Quiz
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </button>
            </div>
          </div>

          {/* Teacher Card */}
          <div
            onClick={() => navigate("/teacher")}
            className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 cursor-pointer hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/20 rounded-full filter blur-2xl group-hover:bg-pink-600/30 transition-all"></div>

            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-pink-500/30">
              👨‍🏫
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              I'm a Teacher
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Create custom quizzes on any topic, set difficulty level and share instantly with students via a code.
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="bg-pink-500/20 text-pink-300 text-xs px-3 py-1 rounded-full border border-pink-500/30">Custom</span>
                <span className="bg-pink-500/20 text-pink-300 text-xs px-3 py-1 rounded-full border border-pink-500/30">Shareable</span>
              </div>
              <button className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-pink-500/30">
                Create Quiz
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </button>
            </div>
          </div>

        </div>

        {/* Join Quiz */}
        <div className="mt-8 mb-4">
            <button
             onClick={() => navigate("/join")}
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
         🔑 Have a code? Join Quiz
             </button>
        </div>
        
        {/* Stats Bar */}
        <div className="flex items-center gap-12 bg-white/5 border border-white/10 rounded-2xl px-12 py-6">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-gray-500 text-sm mt-1">Universities</div>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-gray-500 text-sm mt-1">Subjects</div>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Gemini
            </div>
            <div className="text-gray-500 text-sm mt-1">AI Powered</div>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Free
            </div>
            <div className="text-gray-500 text-sm mt-1">Always</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Landing