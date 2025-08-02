// Job automático para cierre de caja diario a las 10pm hora Perú
import cron from 'node-cron';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es.js';

// Configuración: hora Perú = UTC-5, así que 10pm Perú = 03:00 UTC
cron.schedule('0 3 * * *', async () => {
  try {
    // Buscar técnico admin (puedes ajustar el id si tienes uno fijo)
    const tecnico_id = 4; // Cambia esto por el id real del técnico admin
    // Lógica para obtener totales (puedes mejorar esto si tienes endpoint interno)
    const pagosPendientesRes = await axios.get('https://servidorserviciotecnicolima-production.up.railway.app/api/pagos/no-cuadrados');
    const pagos = pagosPendientesRes.data.data || pagosPendientesRes.data.pagos || [];
    const totalPendiente = pagos.reduce((acc, pago) => acc + (parseFloat(pago.monto) || 0), 0);
    const efectivo = pagos.filter(p => p.metodo_pago === 'Efectivo');
    const electronicos = pagos.filter(p => ['Yape', 'Plin', 'Transferencia', 'Tarjeta'].includes(p.metodo_pago));
    const totalEfectivo = efectivo.reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0);
    const totalElectronico = electronicos.reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0);
    // Crear cierre de caja
    await axios.post('https://servidorserviciotecnicolima-production.up.railway.app/api/cierres-caja', {
      tecnico_id,
      monto_cierre: totalPendiente,
      monto_efectivo: totalEfectivo,
      monto_debito: totalElectronico,
      observaciones: 'Cierre automático diario',
      fecha_cierre: dayjs().locale('es').format('YYYY-MM-DD HH:mm:ss')
    });
    console.log(`[CierreCajaJob] Cierre de caja automático realizado a las ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
  } catch (err) {
    console.error('[CierreCajaJob] Error en cierre de caja automático:', err.message);
  }
});

// Puedes importar este archivo en app.js para que el job se active al iniciar el servidor.
