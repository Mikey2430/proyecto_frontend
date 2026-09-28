import axios from "axios";

//const API_BASE = "http://localhost:8080/api/v1/aprendiz";
const API_BASE = "https://proyecto-backend-wj4f.onrender.com/api/v1/aprendiz";

const headers = { "Content-Type": "application/json" };

export const aprendizService = {
  fetchTodos: async () => {
    const res = await axios.get(API_BASE);
    return res.data || [];
  },

  fetchPorId: async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
  },

  crear: async (form) => {
    const res = await axios.post(API_BASE, form, { headers });
    return res.data;
  },

  actualizar: async (id, form) => {
    const res = await axios.put(`${API_BASE}/${id}`, form, { headers });
    return res.data;
  },

  eliminar: async (id) => {
    const res = await axios.delete(`${API_BASE}/${id}`);
    return res.data;
  }
};

// Estado inicial del formulario (mismos nombres que el backend: AprendizEntity)
export const formInitialState = {
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  correo: "",
  celular: "",
  direccion: "",
  cedula: "",
  tipoDePrograma: "",
  programa: "",
  ficha: "",
  regional: ""
};