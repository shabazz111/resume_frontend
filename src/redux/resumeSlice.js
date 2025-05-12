import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  phone: "",
  role: "",
  presentCompany: "",
  summary: "",
  projects: [],
  skills: [],
  education: "",
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    deleteProject: (state, action) => {
      state.projects.splice(action.payload, 1);
    },
    updateSkills: (state, action) => {
      state.skills = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    addSkill: (state, action) => {
      state.skills.push({ title: "", skill: "" });
    },
    updateSkill: (state, action) => {
      const { index, key, value } = action.payload;
      state.skills[index] = { ...state.skills[index], [key]: value };
    },
    removeSkill: (state, action) => {
      state.skills.splice(action.payload, 1);
    },
  },
});

// ✅ Export actions
export const {
  updateField,
  addProject,
  deleteProject,
  updateSkills,
  setProjects, // <== this must match reducer key exactly
  addSkill,
  updateSkill,
  removeSkill,
} = resumeSlice.actions;

// ✅ Export reducer
export default resumeSlice.reducer;
