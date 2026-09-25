import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
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
<<<<<<< HEAD
    primary: { main: "#22d3ee" },       // cian
    secondary: { main: "#a78bfa" },     // violeta
    error: { main: "#ef4444" },
    background: { default: "#0b1220", paper: "#111827" }, // dark limpio
=======
    primary: { main: "#22d3ee" },
    secondary: { main: "#a78bfa" },
    error: { main: "#ef4444" },
    background: { default: "#0b1220", paper: "#111827" },
>>>>>>> Feature/Cambios
    text: { primary: "#e5e7eb", secondary: "#94a3b8" }
  }
});

<<<<<<< HEAD


const inputSX = {
  bgcolor: "#f3f4f6",       // fondo claro para inputs
  borderRadius: 1,
  input: { color: "#111827" },
  "& .MuiInputLabel-root": { color: "#374151" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22d3ee" }
};

const ListaAprendices = () => {
  const API_BASE = "http://localhost:8080/api/v1/aprendiz";
  //const API_BASE = "https://backadso-production.up.railway.app/api/v1/aprendiz"

=======
const PrincipalView = () => {
>>>>>>> Feature/Cambios
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

<<<<<<< HEAD
  const fetchTodos = async () => {  
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setData(res.data || []);
    } catch (e) {
      console.error("Error cargando aprendices:", e);
      setData([]);
    } finally { setLoading(false); }
  };

  const fetchPorId = async () => {
  if (!idFiltro) return;
  try {
    setLoading(true);
    const res = await axios.get(`${API_BASE}/${idFiltro}`);
    setData(res.data ? [res.data] : []);

    // Rellenar el formulario con los datos traídos
    if (res.data) {
      setForm({
        nombre: res.data.nombre ?? "",
        apellido: res.data.apellido ?? "",
        email: res.data.email ?? "",
        telefono: res.data.telefono ?? "",
        direccion: res.data.direccion ?? "",
        cedula: res.data.cedula ?? "",
        tipoDePrograma: res.data.tipoDePrograma ?? "",
        programa: res.data.programa ?? "",
        ficha: res.data.ficha ?? "",
        regional: res.data.regional ?? ""
      });
    }
  } catch {
    setData([]);
  } finally {
    setLoading(false);
  }
};
=======
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
>>>>>>> Feature/Cambios

  const crearAprendiz = async () => {
    if (!form.primerNombre?.trim() || !form.primerApellido?.trim() || !form.correo?.trim() || !form.cedula?.trim()) {
      fail("Completa al menos: Primer Nombre, Primer Apellido, Correo y Cédula.");
      return;
    }
    try {
      setLoading(true);
      await aprendizService.crear(form);
      setForm(formInitialState);
      await fetchTodos();
      ok("Aprendiz creado.");
    } catch (e) {
      console.error("Error creando aprendiz:", e);
      fail(`No se pudo crear: ${errorBackend(e, "revisa correo/cédula duplicados.")}`);
    } finally {
      setLoading(false);
    }
>>>>>>> Feature/Cambios
  };

  const eliminarPorId = async () => {
    if (!idFiltro) return;
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
>>>>>>> Feature/Cambios
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

<<<<<<< HEAD
export default ListaAprendices;
=======
export default PrincipalView;
>>>>>>> Feature/Cambios
