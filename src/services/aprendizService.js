import axios from "axios";

// Usa VITE_API_URL del .env, con fallback a localhost
const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1/aprendiz";

const headers = { "Content-Type": "application/json" };

// Crea el cliente para la BD elegida: "mysql" o "mongodb"
export const crearServicio = (bd) => {
  const API_BASE = bd === "mongodb" ? `${API_ROOT}/mongo` : API_ROOT;
  return {
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
};

// Por defecto: MySQL (lo que ya existía)
export const aprendizService = crearServicio("mysql");

// Mismos nombres que el backend: AprendizEntity.java
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
