const esVendedor = (usuarioId, propieddUsuarioId) => {
  return usuarioId === propieddUsuarioId
}
const formatearFecha = (fecha) => {
  const fechaSinT = new Date(fecha).toISOString().split('T')[0]
  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(fechaSinT).toLocaleDateString('es-ES', opciones)
}
export {
  esVendedor,
  formatearFecha
}
