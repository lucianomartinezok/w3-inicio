# Demo Web3 — Aprendé blockchain desde cero

Una aplicación pedagógica para entender Web3 **sin instalar nada de blockchain**.
Primero validás la experiencia (v0), después conectás la red real (v1).

---

## Parte A: Correr v0 (simulación, ahora mismo)

```bash
cd web3-demo
npm install
npm run dev
```

Abrí `http://localhost:5173`. **No necesitás MetaMask, ni ETH, ni nada de Web3.**

El banner amarillo arriba indica que estás en modo simulación. Todo funciona igual que en la blockchain real, pero sin salir de tu computadora.

### ¿Qué podés hacer en v0?
- Conectar una "wallet" simulada (aparece un popup estilo MetaMask)
- Leer el mensaje actual del contrato (operación gratuita)
- Escribir un mensaje (con firma simulada, espera de minado y hash fake)
- Ver el "bloque" y el "hash" de la transacción confirmada
- Explorar el diccionario de 35+ términos con gráficos
- Activar Modo Técnico para ver las llamadas JSON-RPC

### Para testear errores
Agrega a la URL:
- `?fallo=firma` → simula que el usuario rechaza en MetaMask
- `?fallo=red` → simula que la red es incorrecta

---

## Parte B: Migrar a v1 (blockchain real)

### Requisitos
1. Tener **MetaMask** instalado: [metamask.io](https://metamask.io)
2. Tener **ETH de prueba** en Sepolia: [sepoliafaucet.com](https://sepoliafaucet.com) o [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

### Checklist de migración

**1. Deployar el contrato en Remix**

- Abrí [remix.ethereum.org](https://remix.ethereum.org)
- Creá un archivo `RegistroInmutable.sol` y pegá el contenido de `contracts/RegistroInmutable.sol`
- Tab **Solidity Compiler** → compilar con versión `0.8.x`
- Tab **Deploy & Run** → Environment: *Injected Provider - MetaMask*
- Asegurate de estar en **Sepolia** en MetaMask
- Click **Deploy** → confirmá en MetaMask
- Copiá la **dirección del contrato** que aparece abajo (ej: `0x8bA3...`)
- Copiá el **ABI** (botón "Copy ABI" en la pestaña Compiler)

**2. Pegar la ABI**

Reemplazá el contenido de `src/abi/RegistroInmutable.json` con el ABI copiado.

**3. Configurar la dirección**

Creá un archivo `.env` en la raíz del proyecto:
```
VITE_CONTRACT_ADDRESS=0x8bA3...tu_direccion_aqui...
```

**4. Instalar Ethers.js**

```bash
npm install ethers
```

**5. Activar el módulo real**

En `src/services/web3.js`, cambiar la línea:
```js
// Antes (v0):
export { ... } from './web3Mock';

// Después (v1):
export { ... } from './web3Real';
```

**6. Implementar web3Real.js**

El archivo `src/services/web3Real.js` tiene todos los pasos marcados como `TODO v1-1`, `TODO v1-2`, etc.
Descomentá el código de cada sección siguiendo los comentarios.

**7. Reiniciar**

```bash
npm run dev
```

El banner amarillo desaparece automáticamente. Todo lo demás funciona igual: el narrador, los gráficos, el diccionario.

---

## Estructura del proyecto

```
web3-demo/
├── contracts/
│   └── RegistroInmutable.sol    ← Solidity comentado para principiantes
├── src/
│   ├── services/
│   │   ├── web3.js              ← Cambiar esta línea para v1
│   │   ├── web3Mock.js          ← Simulación completa
│   │   └── web3Real.js          ← TODOs para v1
│   ├── data/
│   │   └── diccionario.js       ← 35+ términos Web3
│   ├── components/
│   │   ├── graficos/            ← 9 diagramas SVG
│   │   ├── Termino.jsx          ← Tooltip educativo reutilizable
│   │   ├── PanelNarrador.jsx    ← Log en vivo
│   │   └── ...
│   └── pages/
│       ├── PaginaDemo.jsx       ← ruta /
│       └── PaginaDiccionario.jsx ← ruta /diccionario
└── README.md
```

---

## Glosario rápido (ver gráficos en la app)

| Término | Definición corta | Analogía |
|---|---|---|
| **Blockchain** | Registro compartido e inmutable entre miles de nodos | Cuaderno de contabilidad que todos tienen y nadie puede borrar |
| **Wallet** | Guarda tu clave privada para firmar operaciones | Llavero digital (no guarda monedas, guarda la llave) |
| **Address** | Tu "número de cuenta" en Ethereum (0x...) | CBU o número de cuenta bancaria |
| **Clave privada** | Secreto que te permite firmar. NUNCA compartir | Combinación de tu caja fuerte |
| **Firma digital** | Prueba matemática de que vos autorizaste algo | Firma en un cheque, pero imposible de falsificar |
| **Smart Contract** | Programa que vive en la blockchain, autoejecutable | Máquina expendedora: condición → resultado automático |
| **ABI** | "Menú" de funciones del contrato en JSON | El menú de un restaurante: dice qué podés pedir |
| **Gas** | Unidad de trabajo computacional en Ethereum | Nafta del auto: más compleja la operación, más gas |
| **Wei / Gwei / ETH** | Unidades de ETH (1 ETH = 10^18 Wei) | Centavos → pesos → miles de pesos |
| **Testnet** | Red de pruebas con ETH sin valor real | Simulador de vuelo: mismas reglas, sin consecuencias |
| **Sepolia** | La testnet oficial de Ethereum en 2025 | chainId: 11155111 |
| **Faucet** | Servicio que regala ETH de testnet gratis | Fichas gratis del casino de práctica |
| **Provider** | Conexión de lectura a la blockchain | Lector de un libro (no escribe) |
| **Signer** | Provider con acceso a clave privada para firmar | Lector + bolígrafo (puede firmar) |
| **Hash** | Huella digital única de 64 caracteres hex | Número de seguimiento de un paquete, pero irreversible |
| **Bloque** | Paquete de transacciones cada ~12 segundos | Página de libro contable sellada y archivada |
| **Nonce** | Contador de transacciones de una address | Número de turno en una oficina |
| **RPC** | Protocolo de comunicación con la blockchain | Teléfono entre tu app y el nodo de Ethereum |
| **chainId** | Identificador único de cada red Ethereum | Código de área telefónico |
| **Etherscan** | Explorador de bloques: busca cualquier tx o wallet | Rastreador de paquetes de correo para la blockchain |

Para el glosario completo con gráficos: abrí `/diccionario` en la app.
