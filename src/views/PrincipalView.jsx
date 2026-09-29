import React, { useState, useEffect, useMemo } from "react";
import { Box, CssBaseline, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  ActionBar,
  AprendizForm,
  AprendizTable,
  Mensaje
} from "../components/AprendizComponents";

import {
  aprendizService,
  crearServicio,
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
  const [mensaje, setMensaje] = useState(null);
  const ok = (texto) => setMensaje({ texto, tipo: "ok" });
  const fail = (texto) => setMensaje({ texto, tipo: "error" });
  const sinConexion = (e) => e?.code === "ERR_NETWORK" || e?.response?.status === 403;
  const errorCrear = (e) =>
    sinConexion(e) ? "Sin conexión con el servidor."
    : "No se pudo crear. Correo o cédula duplicados.";
  // BD activa: "mysql" o "mongodb". El switch cambia a dónde van crear/actualizar/eliminar
  const [bd, setBd] = useState("mysql");
  const servicio = useMemo(() => (bd === "mongodb" ? crearServicio("mongodb") : aprendizService), [bd]);

  // Cambiar de BD limpia todo y recarga de la otra base
  const cambiarBd = (_, nuevaBd) => {
    if (!nuevaBd || nuevaBd === bd) return;
    setBd(nuevaBd);
    setIdFiltro("");
    setForm(formInitialState);
    setData([]);
    setMensaje(null);
  };

  /* ---------- Handlers ---------- */
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setMensaje(null);
      const result = await servicio.fetchTodos();
      setData(Array.isArray(result) ? result : []);
    } catch (e) {
      console.error("Error cargando aprendices:", e);
      setData([]);
      fail("No se pudo cargar la lista. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      setMensaje(null);
      const res = await servicio.fetchPorId(idFiltro);
      setData(res ? [res] : []);
      if (res) {
        ok("Aprendiz encontrado.");
        setForm({
          primerNombre: res.primerNombre ?? "",
          segundoNombre: res.segundoNombre ?? "",
          primerApellido: res.primerApellido ?? "",
          segundoApellido: res.segundoApellido ?? "",
          correo: res.correo ?? "",
          celular: res.celular ?? "",
          direccion: res.direccion ?? "",
          cedula: res.cedula ?? "",
          tipoDePrograma: res.tipoDePrograma ?? "",
          programa: res.programa ?? "",
          ficha: res.ficha ?? "",
          regional: res.regional ?? ""
        });
      }
    } catch (e) {
      setData([]);
      fail(e?.response?.status === 404 ? "No existe un aprendiz con ese ID." : "No se pudo buscar. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const crearAprendiz = async () => {
    try {
      setLoading(true);
      setMensaje(null);
      await servicio.crear(form);
      setForm(formInitialState);
      await fetchTodos();
      ok("Aprendiz creado correctamente.");
    } catch (e) {
      console.error("Error creando aprendiz:", e);
      fail(errorCrear(e));
    } finally {
      setLoading(false);
    }
  };

  const eliminarPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      setMensaje(null);
      await servicio.eliminar(idFiltro);
      await fetchTodos();
      ok("Aprendiz eliminado correctamente.");
    } catch (e) {
      console.error("Error eliminando aprendiz:", e);
      fail(e?.response?.status === 404 ? "No existe un aprendiz con ese ID." : "No se pudo eliminar. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const actualizarPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      setMensaje(null);
      await servicio.actualizar(idFiltro, form);
      setForm(formInitialState);
      await fetchTodos();
      ok("Aprendiz actualizado correctamente.");
    } catch (e) {
      console.error("Error actualizando aprendiz:", e.response?.data || e.message);
      fail(e?.response?.status === 404 ? "No existe un aprendiz con ese ID." : "No se pudo actualizar. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Render ---------- */
  // Carga inicial y recarga al cambiar de BD
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bd]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
        <ToggleButtonGroup
          value={bd}
          exclusive
          onChange={cambiarBd}
          aria-label="Base de datos"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="mysql" aria-label="MySQL">MySQL</ToggleButton>
          <ToggleButton value="mongodb" aria-label="MongoDB">MongoDB</ToggleButton>
        </ToggleButtonGroup>

        <ActionBar
          loading={loading}
          idFiltro={idFiltro}
          setIdFiltro={setIdFiltro}
          onFetchTodos={fetchTodos}
          onFetchPorId={fetchPorId}
          onEliminar={eliminarPorId}
          onActualizar={actualizarPorId}
        />

        <Mensaje mensaje={mensaje} />

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