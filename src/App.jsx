import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import StudentForm from "./pages/StudentForm"
import TeacherForm from "./pages/TeacherForm"
import Quiz from "./pages/Quiz"
import Results from "./pages/Results"
import TeacherQuiz from "./pages/TeacherQuiz"
import JoinQuiz from "./pages/JoinQuiz"
import SharedQuiz from "./pages/SharedQuiz"
import Dashboard from "./pages/Dashboard"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Leaderboard from "./pages/Leaderboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/student" element={<StudentForm />} />
        <Route path="/teacher" element={<TeacherForm />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/teacher-quiz" element={<TeacherQuiz />} />
        <Route path="/join/:code" element={<JoinQuiz />} />
        <Route path="/join" element={<JoinQuiz />} />
        <Route path="/shared-quiz" element={<SharedQuiz />} />
        <Route path="/dashboard/:code" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App