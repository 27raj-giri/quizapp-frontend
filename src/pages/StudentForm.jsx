import { useState } from "react"
import { useNavigate } from "react-router-dom"

const universityData = {
  "Madhya Pradesh": {
    university: "RGPV",
    streams: {
      "Computer Science": {
        "1st Year": ["Mathematics-1", "Physics", "Basic Electronics", "English"],
        "2nd Year": ["Data Structures", "DBMS", "Computer Networks", "OOP with Java"],
        "3rd Year": ["Operating Systems", "Artificial Intelligence", "Web Development", "Software Engineering"],
        "4th Year": ["Machine Learning", "Cloud Computing", "Cyber Security", "Project"]
      },
      "Mechanical": {
        "1st Year": ["Mathematics-1", "Physics", "Engineering Drawing", "Workshop"],
        "2nd Year": ["Thermodynamics", "Fluid Mechanics", "Material Science", "Manufacturing"],
        "3rd Year": ["Heat Transfer", "Machine Design", "CAD/CAM", "Industrial Engineering"],
        "4th Year": ["Automobile Engineering", "Robotics", "Quality Control", "Project"]
      },
      "Civil": {
        "1st Year": ["Mathematics-1", "Physics", "Engineering Drawing", "English"],
        "2nd Year": ["Structural Analysis", "Fluid Mechanics", "Surveying", "Building Materials"],
        "3rd Year": ["RCC Design", "Geotechnical Engineering", "Transportation", "Hydrology"],
        "4th Year": ["Project Management", "Environmental Engineering", "Estimation", "Project"]
      }
    }
  },
  "Uttar Pradesh": {
    university: "AKTU",
    streams: {
      "Computer Science": {
        "1st Year": ["Mathematics-1", "Physics", "Basic Electrical", "Communication Skills"],
        "2nd Year": ["Data Structures", "DBMS", "Computer Organization", "Discrete Mathematics"],
        "3rd Year": ["Operating Systems", "Machine Learning", "Web Technology", "Compiler Design"],
        "4th Year": ["Deep Learning", "IoT", "Information Security", "Project"]
      },
      "Mechanical": {
        "1st Year": ["Mathematics-1", "Physics", "Engineering Drawing", "Basic Electronics"],
        "2nd Year": ["Thermodynamics", "Strength of Materials", "Fluid Mechanics", "Manufacturing"],
        "3rd Year": ["Heat Transfer", "Theory of Machines", "Industrial Engineering", "CAD"],
        "4th Year": ["Automobile Engineering", "Robotics", "Total Quality Management", "Project"]
      },
      "Civil": {
        "1st Year": ["Mathematics-1", "Chemistry", "Engineering Drawing", "Communication"],
        "2nd Year": ["Structural Analysis", "Surveying", "Building Materials", "Fluid Mechanics"],
        "3rd Year": ["RCC Design", "Soil Mechanics", "Transportation Engineering", "Hydrology"],
        "4th Year": ["Project Management", "Environmental Engineering", "Quantity Surveying", "Project"]
      }
    }
  },
  "Maharashtra": {
    university: "Mumbai University",
    streams: {
      "Computer Science": {
        "1st Year": ["Applied Mathematics", "Physics", "Basic Electronics", "C Programming"],
        "2nd Year": ["Data Structures", "DBMS", "Computer Networks", "Java Programming"],
        "3rd Year": ["Operating Systems", "AI & ML", "Web Development", "Software Testing"],
        "4th Year": ["Big Data", "Cloud Computing", "Blockchain", "Project"]
      },
      "Mechanical": {
        "1st Year": ["Applied Mathematics", "Physics", "Engineering Drawing", "Workshop"],
        "2nd Year": ["Thermodynamics", "Fluid Mechanics", "Metallurgy", "Manufacturing"],
        "3rd Year": ["Heat Transfer", "Machine Design", "Mechatronics", "Industrial Management"],
        "4th Year": ["Automobile Engineering", "Robotics", "Operations Research", "Project"]
      },
      "Civil": {
        "1st Year": ["Applied Mathematics", "Physics", "Engineering Drawing", "Communication"],
        "2nd Year": ["Structural Analysis", "Fluid Mechanics", "Surveying", "Construction Materials"],
        "3rd Year": ["RCC Design", "Geotechnical", "Transportation", "Environmental Engineering"],
        "4th Year": ["Project Management", "Urban Planning", "Estimation & Costing", "Project"]
      }
    }
  },
  "Rajasthan": {
    university: "RTU",
    streams: {
      "Computer Science": {
        "1st Year": ["Mathematics-1", "Physics", "C Programming", "English"],
        "2nd Year": ["Data Structures", "DBMS", "Computer Networks", "Java"],
        "3rd Year": ["Operating Systems", "AI", "Web Technology", "Software Engineering"],
        "4th Year": ["Machine Learning", "Cloud", "Security", "Project"]
      },
      "Mechanical": {
        "1st Year": ["Mathematics-1", "Physics", "Drawing", "Workshop"],
        "2nd Year": ["Thermodynamics", "Fluid Mechanics", "Material Science", "Manufacturing"],
        "3rd Year": ["Heat Transfer", "Machine Design", "CAD", "Industrial Engg"],
        "4th Year": ["Automobile", "Robotics", "Quality", "Project"]
      },
      "Civil": {
        "1st Year": ["Mathematics-1", "Physics", "Drawing", "English"],
        "2nd Year": ["Structural Analysis", "Fluid", "Surveying", "Materials"],
        "3rd Year": ["RCC", "Geotechnical", "Transportation", "Hydrology"],
        "4th Year": ["Project Management", "Environmental", "Estimation", "Project"]
      }
    }
  }
}

function StudentForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    state: "",
    university: "",
    college: "",
    year: "",
    stream: "",
    subject: ""
  })

  const states = Object.keys(universityData)
  const streams = formData.state ? Object.keys(universityData[formData.state].streams) : []
  const years = formData.state && formData.stream
    ? Object.keys(universityData[formData.state].streams[formData.stream])
    : []
  const subjects = formData.state && formData.stream && formData.year
    ? universityData[formData.state].streams[formData.stream][formData.year]
    : []

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      if (field === "state") {
        updated.university = universityData[value]?.university || ""
        updated.stream = ""
        updated.year = ""
        updated.subject = ""
      }
      if (field === "stream") {
        updated.year = ""
        updated.subject = ""
      }
      if (field === "year") {
        updated.subject = ""
      }
      return updated
    })
  }

  const handleSubmit = () => {
    localStorage.setItem("studentData", JSON.stringify(formData))
    navigate("/quiz", { state: formData })
  }

  const inputClass = "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
  const selectClass = "w-full bg-[#1a1a2e] border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white flex items-center justify-center px-4 py-10">

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to Home
        </button>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <h1 className="text-2xl font-bold">Student Details</h1>
              <p className="text-gray-400 text-sm">Fill your details to get started</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">

            {/* Name & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={e => handleChange("name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Age</label>
                <input
                  type="number"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={e => handleChange("age", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">State</label>
              <select
                value={formData.state}
                onChange={e => handleChange("state", e.target.value)}
                className={selectClass}
              >
                <option value="">Select your state</option>
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* University - Auto filled */}
            {formData.university && (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">University</label>
                <div className="w-full bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-300 font-medium">
                  ✓ {formData.university}
                </div>
              </div>
            )}

            {/* College */}
            {formData.state && (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">College Name</label>
                <input
                  type="text"
                  placeholder="Enter your college name"
                  value={formData.college}
                  onChange={e => handleChange("college", e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {/* Stream */}
            {formData.state && (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Stream</label>
                <select
                  value={formData.stream}
                  onChange={e => handleChange("stream", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select your stream</option>
                  {streams.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Year */}
            {formData.stream && (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Year</label>
                <select
                  value={formData.year}
                  onChange={e => handleChange("year", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select your year</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Subjects */}
            {formData.year && (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Subject</label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map(sub => (
                    <button
                      key={sub}
                      onClick={() => handleChange("subject", sub)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                        formData.subject === sub
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            {formData.subject && formData.name && formData.college && (
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all mt-4 shadow-lg shadow-purple-500/30"
              >
                Generate My Quiz 🚀
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentForm