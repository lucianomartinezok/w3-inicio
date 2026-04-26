/**
 * Registro central de gráficos.
 * El id debe coincidir con el campo `graficoId` del diccionario.
 */
import GraficoBlockchain from './GraficoBlockchain';
import GraficoWallet from './GraficoWallet';
import GraficoConectar from './GraficoConectar';
import GraficoLeerVsEscribir from './GraficoLeerVsEscribir';
import GraficoFirma from './GraficoFirma';
import GraficoCicloTx from './GraficoCicloTx';
import GraficoGas from './GraficoGas';
import GraficoRedes from './GraficoRedes';
import GraficoProviderSigner from './GraficoProviderSigner';

export const GRAFICOS = {
  GraficoBlockchain,
  GraficoWallet,
  GraficoConectar,
  GraficoLeerVsEscribir,
  GraficoFirma,
  GraficoCicloTx,
  GraficoGas,
  GraficoRedes,
  GraficoProviderSigner,
};

export function getGrafico(id) {
  return GRAFICOS[id] || null;
}
