import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { X } from "lucide-react"; // Import delete icon
const Resume = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    presentCompany: "",
    summary: "",
    projects: [], // ✅ Add this!
    education: "",
  });

  const [project, setProject] = useState({
    title: "",
    role: "",
    responsibilities: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    phone: false,
  });
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [experienceList, setExperienceList] = useState([]);
  const [experience, setExperience] = useState({
    role: "",
    company: "",
    duration: "",
  });
  const [skills, setSkills] = useState([{ title: "", skill: "" }]);

  // Add Project
  // Add Project
  const addProject = () => {
    if (
      project.title.trim() === "" &&
      project.role.trim() === "" &&
      project.responsibilities.trim() === "" &&
      project.description.trim() === ""
    ) {
      return;
    }

    const formattedResponsibilities = project.responsibilities
      .split("\n")
      .map((line) => {
        const cleanLine = line.replace(/^[^\w]*|[•→✔➡→\-]+/g, "").trim(); // removes leading junk and extra bullets
        return cleanLine ? `${cleanLine}` : null;
      })
      .filter(Boolean);

    const formattedProject = {
      title: project.title.trim(),
      role: project.role.trim(),
      responsibilities: formattedResponsibilities, // 👈 store as array
      description: project.description.trim(),
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      projects: [...prevFormData.projects, formattedProject],
    }));

    setProject({
      title: "",
      role: "",
      responsibilities: "",
      description: "",
    });

    setShowProjectForm(false);
  };

  // Delete Project
  const deleteProject = (indexToDelete) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      projects: prevFormData.projects.filter(
        (_, index) => index !== indexToDelete
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }

      setErrors({
        ...errors,
        phone: numericValue.length !== 10,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
    setFormData({ ...formData, skills: newSkills });
  };

  // Add Skill
  const addSkillRow = () => {
    setSkills([...skills, { title: "", skill: "" }]);
  };

  const removeSkillRow = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const generateResume = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("role", formData.role || "");
      formDataToSend.append("summary", formData.summary.trim() || "");
      formDataToSend.append("presentCompany", formData.presentCompany || "");
      formDataToSend.append("skills", JSON.stringify(formData.skills || []));
      formDataToSend.append(
        "projects",
        JSON.stringify(formData.projects || [])
      );
      formDataToSend.append("education", formData.education || "");

      const response = await axios.post(
        "https://resume-backend-i655.onrender.com/api/resumes/generate",
        formDataToSend,
        { responseType: "blob" }
      );

      // Helper to capitalize the first letter
      const capitalize = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

      // Construct file name like: shabazz_angular_HSS.docx
      const namePart = capitalize(
        formData.name?.split(" ")[0]?.toLowerCase() || "user"
      );
      const rolePart = capitalize(formData.role?.toLowerCase() || "developer");
      const fileName = `${namePart}_${rolePart}_HSS.docx`;

      // Download the generated DOCX file
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Resume Builder
        </h2>

        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "email", "phone", "role"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className={`border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                field === "phone" && errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              onChange={handleChange}
              onPaste={(e) => {
                if (field === "phone") {
                  const pasted = e.clipboardData.getData("text");
                  if (!/^\d+$/.test(pasted)) {
                    e.preventDefault();
                  }
                }
              }}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Summary</h3>
          <textarea
            name="summary"
            placeholder="Write a short summary about yourself"
            className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.summary} // ✅ This ensures textarea shows updated value
            onChange={handleChange}
            onBlur={(e) => {
              setFormData((prev) => ({
                ...prev,
                summary: prev.summary.trim(),
              }));
            }}
            onPaste={(e) => {
              e.preventDefault(); // Prevent the default paste behavior

              let pastedText = e.clipboardData.getData("text");

              pastedText = pastedText
                .replace(/\r\n|\r/g, "\n")
                .replace(/^\s+|\s+$/g, "")
                .replace(/\n\s*\n/g, "\n")
                .split("\n")
                .map((line) => {
                  line = line.trim();
                  return line.startsWith("•")
                    ? "• " + line.slice(1).trim()
                    : "• " + line;
                })
                .join("\n");

              const textarea = e.target;
              const { selectionStart, selectionEnd, value } = textarea;

              const newText =
                value.slice(0, selectionStart) +
                pastedText +
                value.slice(selectionEnd);

              // Update formData
              setFormData((prev) => ({
                ...prev,
                summary: newText,
              }));
            }}
          ></textarea>
        </div>

        {/* Present Company */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Present Company Details
          </h3>
          <textarea
            name="presentCompany"
            placeholder="Company Details"
            className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Projects */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Projects</h3>

          {formData.projects.length > 0 ? (
            formData.projects.map((proj, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-gray-50 rounded-md p-4 mb-4 flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold text-blue-700">{proj.title}</p>
                  <p className="text-sm text-gray-600">Role: {proj.role}</p>
                  <p className="text-sm text-gray-600">
                    Responsibilities: {proj.responsibilities}
                  </p>
                  <p className="text-sm text-gray-600">
                    Description: {proj.description}
                  </p>
                </div>
                <FaTrash
                  className="text-red-500 cursor-pointer ml-4 mt-1 hover:text-red-700"
                  onClick={() => deleteProject(index)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No projects added yet.</p>
          )}

          {showProjectForm ? (
            <div className="mt-4 grid gap-3">
              <input
                type="text"
                placeholder="Project Title"
                className="border p-2 rounded-md"
                value={project.title}
                onChange={(e) =>
                  setProject({ ...project, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Role"
                className="border p-2 rounded-md"
                value={project.role}
                onChange={(e) =>
                  setProject({ ...project, role: e.target.value })
                }
              />
              <textarea
                placeholder="Responsibilities"
                className="border p-2 rounded-md"
                rows={3}
                value={project.responsibilities}
                onChange={(e) =>
                  setProject({ ...project, responsibilities: e.target.value })
                }
              />
              <textarea
                placeholder="Project Description"
                className="border p-2 rounded-md"
                rows={3}
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
              />
              <button
                onClick={addProject}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Add Project
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowProjectForm(true)}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Add Project
            </button>
          )}
        </div>

        {/* Education */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Education
          </h3>
          <textarea
            name="education"
            placeholder="Education Details"
            className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills</h3>
          {skills.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center gap-2 mb-3"
            >
              <input
                type="text"
                placeholder="Title"
                className="border p-2 rounded-md w-full md:w-1/2"
                value={item.title}
                onChange={(e) =>
                  handleSkillChange(index, "title", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Skill"
                className="border p-2 rounded-md w-full md:w-1/2"
                value={item.skill}
                onChange={(e) =>
                  handleSkillChange(index, "skill", e.target.value)
                }
              />
              <button
                onClick={() => removeSkillRow(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <button
            onClick={addSkillRow}
            className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Add Skill
          </button>
          <button
            onClick={generateResume}
            className="w-full md:w-auto bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
          >
            Generate Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;
