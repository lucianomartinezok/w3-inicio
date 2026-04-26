/**
 * web3.js — Punto de intercambio v0 ↔ v1
 *
 * PARA PASAR A v1: cambiar la línea de abajo:
 *   from './web3Mock'  →  from './web3Real'
 *
 * Nada más. Ningún componente ni hook necesita tocarse.
 */
export { conectarWallet, leerMensaje, enviarMensaje, obtenerInfoContrato } from './web3Mock';
