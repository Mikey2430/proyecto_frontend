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
} from "../services/aprendizService.js";

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
  // BD activa: "mysql" o "mongodb". El switch cambia a dónde van crear/actualizar/eliminar
  const [bd, setBd] = useState("mysql");
  const servicio = useMemo(() => (bd === "mongodb" ? crearServicio("mongodb") : aprendizService), [bd]);

  const ok = (texto) => setMensaje({ texto, tipo: "ok" });
  const fail = (texto) => setMensaje({ texto, tipo: "error" });
  const errorBackend = (e, defecto) =>
    e?.response?.status === 404 ? "No existe ese ID."
    : e?.response?.data?.message || e?.response?.data || e?.message || defecto;

  // Carga inicial y cada vez que cambias de BD
  useEffect(() => {
    fetchTodos();
  }, [bd]);

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
      fail("No se pudo conectar al backend (¿está corriendo en :8080?).");
    } finally {
      setLoading(false);
    }
  };

  const cargarEnForm = (res) => ({
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

  // Clic en una fila = carga ID + formulario (facilita actualizar/eliminar)
  const seleccionarFila = (row) => {
    if (row?.id == null) return;
    setIdFiltro(String(row.id));
    setForm(cargarEnForm(row));
  };

  const fetchPorId = async () => {
    if (!idFiltro) return;
    try {
      setLoading(true);
      setMensaje(null);
      const res = await servicio.fetchPorId(idFiltro);
      setData(res ? [res] : []);
      if (res) {
        setForm(cargarEnForm(res));
      } else {
        fail("No existe ese ID.");
      }
    } catch (e) {
      setData([]);
      fail(String(errorBackend(e, "No existe ese ID.")));
    } finally {
      setLoading(false);
    }
  };

  const crearAprendiz = async () => {
    if (!form.primerNombre?.trim() || !form.primerApellido?.trim() || !form.correo?.trim() || !form.cedula?.trim()) {
      fail("Completa al menos: Primer Nombre, Primer Apellido, Correo y Cédula.");
      return;
    }
    try {
      setLoading(true);
      setMensaje(null);
      await servicio.crear(form);
      setForm(formInitialState);
      await fetchTodos();
      ok("Aprendiz creado.");
    } catch (e) {
      console.error("Error creando aprendiz:", e);
      fail(`No se pudo crear: ${errorBackend(e, "revisa correo/cédula duplicados.")}`);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPorId = async () => {
    if (!idFiltro) return;
    if (!window.confirm(`¿Eliminar el aprendiz con ID ${idFiltro}?`)) return;
    try {
      setLoading(true);
      setMensaje(null);
      await servicio.eliminar(idFiltro);
      setIdFiltro("");
      setForm(formInitialState);
      await fetchTodos();
      ok("Aprendiz eliminado.");
    } catch (e) {
      console.error("Error eliminando aprendiz:", e);
      fail(`No se pudo eliminar: ${errorBackend(e, "verifica el ID.")}`);
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
      ok("Aprendiz actualizado.");
    } catch (e) {
      console.error("Error actualizando aprendiz:", e.response?.data || e.message);
      fail(`No se pudo actualizar: ${errorBackend(e, "verifica el ID y duplicados.")}`);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Render ---------- */
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

        <AprendizTable data={data} onSelect={seleccionarFila} />
      </Box>
    </ThemeProvider>
  );
};

export default PrincipalView;