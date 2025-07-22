import db from "../models/index.js";
const Gasto = db.Gasto;

export const crearGasto = async (data) => {
  // responsable debe ser un ID entero
  if (data.responsable !== undefined && data.responsable !== null) {
    data.responsable = parseInt(data.responsable, 10);
  }
  return await Gasto.create(data);
};

export const obtenerGastos = async () => {
  return await Gasto.findAll();
};

export const obtenerResumenGastos = async () => {
  const gastos = await Gasto.findAll();
  const total = gastos.reduce((acc, g) => acc + parseFloat(g.cantidad), 0);
  const porResponsable = {};
  gastos.forEach(g => {
    if (!porResponsable[g.responsable]) porResponsable[g.responsable] = 0;
    porResponsable[g.responsable] += parseFloat(g.cantidad);
  });
  return { total, porResponsable };
};
