import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  ActionBar,
  AprendizForm,
  AprendizTable
} from "../components/aprendizComponents";

import {
  aprendizService,
  formInitialState
} from "../services/aprendizService";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#22d3ee" },
    secondary: { main: "#a78bfa" },
    error: { main: "#ef4444" },
    background: { default: "#0b1220", paper: "#111827" },
    text: { primary: "#e5e7eb", secondary: "#94a3b8" }
  }
});

const PrincipalView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(formInitialState);
  const [idFiltro, setIdFiltro] = useState("");

  /* ---------- Handlers ---------- */
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const result = await aprendizService.fetchTodos();
      setData(result);
    } catch (e) {
      console.error("Error cargando aprendices:", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      const res = await aprendizService.fetchPorId(idFiltro);
      setData(res ? [res] : []);
      if (res) {
        setForm({
          nombre: res.nombre ?? "",
          apellido: res.apellido ?? "",
          email: res.email ?? "",
          telefono: res.telefono ?? "",
          direccion: res.direccion ?? "",
          cedula: res.cedula ?? "",
          tipoDePrograma: res.tipoDePrograma ?? "",
          programa: res.programa ?? "",
          ficha: res.ficha ?? "",
          regional: res.regional ?? ""
        });
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const crearAprendiz = async () => {
    try {
      setLoading(true);
      await aprendizService.crear(form);
      setForm(formInitialState);
      await fetchTodos();
    } catch (e) {
      console.error("Error creando aprendiz:", e);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      await aprendizService.eliminar(idFiltro);
      await fetchTodos();
    } catch (e) {
      console.error("Error eliminando aprendiz:", e);
    } finally {
      setLoading(false);
    }
  };

  const actualizarPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      await aprendizService.actualizar(idFiltro, form);
      setForm(formInitialState);
      await fetchTodos();
    } catch (e) {
      console.error("Error actualizando aprendiz:", e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Render ---------- */
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        <ActionBar
          loading={loading}
          idFiltro={idFiltro}
          setIdFiltro={setIdFiltro}
          onFetchTodos={fetchTodos}
          onFetchPorId={fetchPorId}
          onEliminar={eliminarPorId}
          onActualizar={actualizarPorId}
        />

        <AprendizForm
          form={form}
          setForm={setForm}
          onCrear={crearAprendiz}
          loading={loading}
        />

        <AprendizTable data={data} />
      </Box>
    </ThemeProvider>
  );
};

export default PrincipalView;