import React from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography, Button, TextField, Stack, Alert
} from "@mui/material";

// Estilo compartido para inputs
export const inputSX = {
  bgcolor: "#f3f4f6",
  borderRadius: 1,
  input: { color: "#111827" },
  "& .MuiInputLabel-root": { color: "#374151" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22d3ee" }
};

/* ===================== Barra de acciones ===================== */
export const ActionBar = ({
  loading, idFiltro, setIdFiltro,
  onFetchTodos, onFetchPorId, onEliminar, onActualizar
}) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: "wrap" }}>
    <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, color: "text.primary" }}>
      Aprendices
    </Typography>
    <Button variant="contained" color="primary" onClick={onFetchTodos} disabled={loading}>
      {loading ? "Cargando..." : "VER TODOS"}
    </Button>
    <TextField
      size="small"
      label="ID"
      value={idFiltro}
      onChange={(e) => setIdFiltro(e.target.value)}
      sx={{ ...inputSX, width: 140 }}
    />
    <Button variant="contained" color="secondary" onClick={onFetchPorId} disabled={loading || !idFiltro}>
      BUSCAR POR ID
    </Button>
    <Button variant="contained" color="error" onClick={onEliminar} disabled={loading || !idFiltro}>
      ELIMINAR POR ID
    </Button>
    <Button variant="contained" color="primary" onClick={onActualizar} disabled={loading || !idFiltro}>
      ACTUALIZAR POR ID
    </Button>
  </Stack>
);

/* ===================== Formulario ===================== */
export const AprendizForm = ({ form, setForm, onCrear, loading }) => {
  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <Paper elevation={4} sx={{ p: 2, mb: 3, border: "1px solid #334155", bgcolor: "background.paper" }}>
      <Typography sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
        Crear aprendiz
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ flexWrap: "wrap" }}>
        <TextField label="Primer Nombre" value={form.primerNombre} onChange={handleChange("primerNombre")} sx={{ ...inputSX, flex: 1 }} />
        <TextField label="Segundo Nombre" value={form.segundoNombre} onChange={handleChange("segundoNombre")} sx={{ ...inputSX, flex: 1 }} />
        <TextField label="Primer Apellido" value={form.primerApellido} onChange={handleChange("primerApellido")} sx={{ ...inputSX, flex: 1 }} />
        <TextField label="Segundo Apellido" value={form.segundoApellido} onChange={handleChange("segundoApellido")} sx={{ ...inputSX, flex: 1 }} />
        <TextField label="Correo" value={form.correo} onChange={handleChange("correo")} sx={{ ...inputSX, flex: 1.2 }} />
        <TextField label="Celular" value={form.celular} onChange={handleChange("celular")} sx={{ ...inputSX, flex: 1 }} />
        <TextField label="Dirección" value={form.direccion} onChange={handleChange("direccion")} sx={{ ...inputSX, flex: 1.6 }} />
        <TextField label="Cedula" value={form.cedula} onChange={handleChange("cedula")} sx={{ ...inputSX, flex: 1 }} />
        <TextField label="Tipo de Programa" value={form.tipoDePrograma} onChange={handleChange("tipoDePrograma")} sx={{ ...inputSX, flex: 1.2 }} />
        <TextField label="Programa" value={form.programa} onChange={handleChange("programa")} sx={{ ...inputSX, flex: 1.2 }} />
        <TextField label="Ficha" value={form.ficha} onChange={handleChange("ficha")} sx={{ ...inputSX, flex: 1 }} />
        <TextField label="Regional" value={form.regional} onChange={handleChange("regional")} sx={{ ...inputSX, flex: 1.2 }} />
        <Button variant="contained" color="primary" onClick={onCrear} disabled={loading}>
          CREAR
        </Button>
      </Stack>
    </Paper>
  );
};

/* ===================== Mensaje ===================== */
export const Mensaje = ({ mensaje }) => (
  mensaje?.texto ? (
    <Alert severity={mensaje.tipo === "error" ? "error" : "success"} sx={{ mb: 2 }}>
      {mensaje.texto}
    </Alert>
  ) : null
);

/* ===================== Tabla ===================== */
const HEADERS = [
  "ID", "Primer Nombre", "Segundo Nombre", "Primer Apellido", "Segundo Apellido",
  "Correo", "Celular", "Dirección", "Cedula", "Tipo de Programa", "Programa", "Ficha", "Regional"
];

export const AprendizTable = ({ data, onSelect }) => (
  <TableContainer component={Paper} elevation={3} sx={{ border: "1px solid #334155", bgcolor: "background.paper" }}>
    <Table>
      <TableHead>
        <TableRow sx={{ background: "#22d3ee" }}>
          {HEADERS.map((h) => (
            <TableCell key={h} sx={{ color: "#0b1220", fontWeight: 700 }}>{h}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, i) => (
          <TableRow
            key={row.id ?? i}
            hover
            onClick={() => onSelect?.(row)}
            sx={{
              cursor: onSelect ? "pointer" : "default",
              backgroundColor: i % 2 === 0 ? "#0f172a" : "#111827",
              "&:hover": { backgroundColor: "#1f2937" }
            }}
          >
            <TableCell sx={{ color: "text.primary" }}>{row.id}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.primerNombre}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.segundoNombre}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.primerApellido}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.segundoApellido}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.correo}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.celular}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.direccion}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.cedula}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.tipoDePrograma}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.programa}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.ficha}</TableCell>
            <TableCell sx={{ color: "text.primary" }}>{row.regional}</TableCell>
          </TableRow>
        ))}
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={13} align="center" sx={{ color: "text.secondary" }}>
              Sin registros
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);