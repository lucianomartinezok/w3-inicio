/**
 * config.js
 * Constantes globales del proyecto.
 * En v1, CONTRACT_ADDRESS vendrá del .env después de deployar en Remix.
 */

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const SEPOLIA_CHAIN_ID = '0xaa36a7';
export const EXPLORER_BASE = 'https://sepolia.etherscan.io';

// Versión de la app: 'mock' = v0 simulada | 'real' = v1 con blockchain
export const APP_VERSION = 'mock';
