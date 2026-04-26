/**
 * useContrato.js
 * El hook central de la app. Encapsula toda la lógica Web3
 * y emite eventos al NarradorContext en cada etapa.
 *
 * Interfaz garantizada (igual en mock y real):
 *   { cuenta, chainId, balance, conectar, leerMensaje, enviarMensaje,
 *     mensajeActual, ultimaTx, cargando, pasoActual, error }
 *
 * Consume services/web3.js — no sabe si es mock o real.
 */

import { useState, useCallback } from 'react';
import { useNarrador } from '../context/NarradorContext';
import {
  conectarWallet as svcConectar,
  leerMensaje as svcLeer,
  enviarMensaje as svcEnviar,
  obtenerInfoContrato,
} from '../services/web3';

// Pasos del flujo (usados por RutaAprendizaje)
export const PASOS = ['wallet', 'red', 'lectura', 'firma', 'minado', 'confirmacion'];

export function useContrato() {
  const { log } = useNarrador();

  const [cuenta, setCuenta] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [mensajeActual, setMensajeActual] = useState('');
  const [ultimaTx, setUltimaTx] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [pasoActual, setPasoActual] = useState(-1); // índice en PASOS

  const infoContrato = obtenerInfoContrato();

  // ── CONECTAR ──────────────────────────────────────────────────
  const conectar = useCallback(async () => {
    setError(null);
    setCargando(true);
    log({ tipo: 'accion', humano: 'Iniciando conexión con tu wallet...', tecnico: 'eth_requestAccounts' });

    try {
      const resultado = await svcConectar((progreso) => {
        const mensajes = {
          detectar:      { tipo: 'info',   humano: '🔍 Buscando MetaMask en el navegador...',           tecnico: 'window.ethereum !== undefined' },
          permiso:       { tipo: 'espera', humano: '🦊 MetaMask encontrado. Abriendo popup de permiso...', tecnico: 'eth_requestAccounts' },
          verificar_red: { tipo: 'info',   humano: '🌐 Verificando que estés en la red Sepolia...',       tecnico: `eth_chainId → esperado: 0xaa36a7` },
          cambiar_red:   { tipo: 'accion', humano: '🔄 Red incorrecta. Cambiando a Sepolia automáticamente...', tecnico: 'wallet_switchEthereumChain' },
          listo:         { tipo: 'exito',  humano: progreso.msg,                                          tecnico: null },
        };
        const evt = mensajes[progreso.paso];
        if (evt) log(evt);
      });

      setCuenta(resultado.cuenta);
      setChainId(resultado.chainId);
      setBalance(resultado.balance);
      setPasoActual(1); // avanza a "Red" en el stepper

      log({
        tipo: 'exito',
        humano: `✅ Wallet conectada: ${resultado.cuenta.slice(0, 10)}...${resultado.cuenta.slice(-4)}`,
        tecnico: `cuenta: ${resultado.cuenta} | chainId: ${resultado.chainId} | balance: ${resultado.balance} ETH`,
      });

      // Leer el mensaje actual automáticamente al conectar
      await _leerMensaje();
      setPasoActual(2); // stepper → "Lectura"

    } catch (e) {
      setError(e.message);
      log({ tipo: 'error', humano: `❌ Error al conectar: ${e.message}`, tecnico: e.stack });
    } finally {
      setCargando(false);
    }
  }, [log]);

  // ── LEER MENSAJE ──────────────────────────────────────────────
  const _leerMensaje = useCallback(async () => {
    log({ tipo: 'info', humano: '📖 Leyendo el mensaje actual del contrato... (gratuito, sin firma)', tecnico: 'contract.mensaje() — view function' });

    const msg = await svcLeer((progreso) => {
      if (progreso.paso === 'leer_ok') {
        log({ tipo: 'exito', humano: progreso.msg });
      }
    });

    setMensajeActual(msg);
    return msg;
  }, [log]);

  const leerMensaje = useCallback(async () => {
    setError(null);
    setCargando(true);
    try {
      const msg = await _leerMensaje();
      return msg;
    } catch (e) {
      setError(e.message);
      log({ tipo: 'error', humano: `❌ Error al leer: ${e.message}` });
    } finally {
      setCargando(false);
    }
  }, [_leerMensaje, log]);

  // ── ENVIAR MENSAJE ────────────────────────────────────────────
  const enviarMensaje = useCallback(async (texto) => {
    if (!cuenta) {
      setError('Primero conectá tu wallet.');
      return;
    }
    if (!texto.trim()) {
      setError('El mensaje no puede estar vacío.');
      return;
    }

    setError(null);
    setCargando(true);
    setPasoActual(3); // stepper → "Firma"
    setUltimaTx(null);

    log({ tipo: 'accion', humano: `📝 Iniciando transacción para guardar: "${texto}"`, tecnico: `actualizarMensaje("${texto}")` });

    try {
      const tx = await svcEnviar(texto, (progreso) => {
        const mensajes = {
          preparar:   { tipo: 'info',   humano: '⚙️ Preparando la transacción...', tecnico: progreso.tecnico },
          firmar:     { tipo: 'espera', humano: '✍️ Esperando tu firma en MetaMask. Revisá el popup...', tecnico: 'signer.sendTransaction(...)' },
          broadcast:  { tipo: 'accion', humano: '📡 Transacción firmada y enviada a la red Sepolia.', tecnico: progreso.tecnico },
          mempool:    { tipo: 'espera', humano: '⏳ En cola (mempool). Los validadores la están procesando...', tecnico: 'mempool → pending' },
          validador:  { tipo: 'espera', humano: '⛏️ Un validador la incluyó en un bloque. Confirmando...', tecnico: 'tx.wait()' },
          confirmada: { tipo: 'exito',  humano: `✅ ${progreso.msg}`, tecnico: progreso.tecnico },
        };
        const evt = mensajes[progreso.paso];
        if (evt) {
          log(evt);
          if (progreso.paso === 'firmar') setPasoActual(3);
          if (progreso.paso === 'mempool') setPasoActual(4); // stepper → "Minado"
          if (progreso.paso === 'confirmada') setPasoActual(5); // stepper → "Confirmación"
        }
      });

      setUltimaTx(tx);
      setMensajeActual(texto);

      log({
        tipo: 'exito',
        humano: `🎉 ¡Listo! Tu mensaje "${texto}" quedó grabado para siempre en la blockchain.`,
        tecnico: `hash: ${tx.hash} | bloque: ${tx.numeroBloque} | gasUsado: ${tx.gasUsado}`,
      });

    } catch (e) {
      setError(e.message);
      log({ tipo: 'error', humano: `❌ ${e.message}`, tecnico: e.stack });
      setPasoActual(cuenta ? 2 : -1);
    } finally {
      setCargando(false);
    }
  }, [cuenta, log]);

  return {
    cuenta,
    chainId,
    balance,
    conectar,
    leerMensaje,
    enviarMensaje,
    mensajeActual,
    ultimaTx,
    cargando,
    pasoActual,
    error,
    infoContrato,
  };
}
