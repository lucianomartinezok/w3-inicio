/**
 * web3Real.js — v1: Implementación real con Ethers.js + MetaMask + Sepolia
 *
 * PARA ACTIVAR EN v1:
 * 1. npm install ethers
 * 2. Deploy del contrato en Remix a Sepolia
 * 3. Pegar la dirección en .env como VITE_CONTRACT_ADDRESS
 * 4. Pegar la ABI en src/abi/RegistroInmutable.json
 * 5. Cambiar en services/web3.js:
 *    from './web3Mock' → from './web3Real'
 */

// TODO v1-1: Descomentar cuando tengas ethers instalado
// import { ethers } from 'ethers';
// import abi from '../abi/RegistroInmutable.json';
// import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from '../config';

/**
 * conectarWallet
 * Pide acceso a MetaMask, verifica chainId Sepolia,
 * ofrece cambiar de red si es necesario.
 */
export async function conectarWallet(onProgreso) {
  // TODO v1-2: Implementar con ethers
  // onProgreso?.({ paso: 'detectar', msg: 'Buscando MetaMask...' });
  // if (!window.ethereum) throw new Error('MetaMask no encontrado. Instalalo en metamask.io');
  //
  // onProgreso?.({ paso: 'permiso', msg: 'Pidiendo permiso a MetaMask...' });
  // const provider = new ethers.BrowserProvider(window.ethereum);
  // await provider.send('eth_requestAccounts', []);
  //
  // const network = await provider.getNetwork();
  // if (network.chainId !== BigInt(parseInt(SEPOLIA_CHAIN_ID, 16))) {
  //   onProgreso?.({ paso: 'cambiar_red', msg: 'Red incorrecta. Cambiando a Sepolia...' });
  //   await window.ethereum.request({
  //     method: 'wallet_switchEthereumChain',
  //     params: [{ chainId: SEPOLIA_CHAIN_ID }],
  //   });
  // }
  //
  // const signer = await provider.getSigner();
  // const cuenta = await signer.getAddress();
  // const balance = ethers.formatEther(await provider.getBalance(cuenta));
  // return { cuenta, chainId: SEPOLIA_CHAIN_ID, balance };

  throw new Error('web3Real no implementado todavía. Seguí los pasos del README para v1.');
}

/**
 * leerMensaje
 * Llama a contract.mensaje() — lectura gratuita, sin firma.
 */
export async function leerMensaje(onProgreso) {
  // TODO v1-3: Implementar con ethers
  // const provider = new ethers.BrowserProvider(window.ethereum);
  // const contrato = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  // onProgreso?.({ paso: 'leer', msg: 'Consultando el contrato (operación gratuita)...' });
  // const msg = await contrato.mensaje();
  // return msg;

  throw new Error('web3Real no implementado todavía.');
}

/**
 * enviarMensaje
 * Ejecuta actualizarMensaje() — transacción con firma y gas.
 */
export async function enviarMensaje(texto, onProgreso) {
  // TODO v1-4: Implementar con ethers
  // const provider = new ethers.BrowserProvider(window.ethereum);
  // const signer = await provider.getSigner();
  // const contrato = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  //
  // onProgreso?.({ paso: 'preparar', msg: 'Estimando gas...', tecnico: `actualizarMensaje("${texto}")` });
  // const gasEst = await contrato.actualizarMensaje.estimateGas(texto);
  //
  // onProgreso?.({ paso: 'firmar', msg: 'Esperando firma en MetaMask...' });
  // const tx = await contrato.actualizarMensaje(texto);
  //
  // onProgreso?.({ paso: 'broadcast', msg: 'Enviada a Sepolia.', tecnico: `txHash: ${tx.hash}` });
  // const receipt = await tx.wait();
  //
  // onProgreso?.({ paso: 'confirmada', msg: `Confirmada en bloque #${receipt.blockNumber}` });
  // return {
  //   hash: tx.hash,
  //   numeroBloque: receipt.blockNumber,
  //   gasUsado: receipt.gasUsed.toString(),
  //   autor: await signer.getAddress(),
  //   timestamp: Date.now(),
  // };

  throw new Error('web3Real no implementado todavía.');
}

export function obtenerInfoContrato() {
  return {
    direccion: import.meta.env.VITE_CONTRACT_ADDRESS || '0x???',
    esMock: false,
  };
}
