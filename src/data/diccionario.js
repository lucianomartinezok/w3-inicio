/**
 * diccionario.js
 * Fuente de verdad de todos los términos Web3 usados en la app.
 * Cada término tiene: id, categoría, título, definición, analogía, ejemplo,
 * id del gráfico asociado y lista de términos relacionados.
 *
 * Este mismo archivo alimenta los tooltips en la UI, la página /diccionario
 * y el apéndice del README.
 */

export const CATEGORIAS = {
  fundamentos: 'Fundamentos',
  identidad: 'Identidad y Wallets',
  contratos: 'Smart Contracts',
  transacciones: 'Transacciones',
  costos: 'Costos y Unidades',
  infraestructura: 'Infraestructura',
};

export const diccionario = [
  // ─── FUNDAMENTOS ───────────────────────────────────────────────
  {
    id: 'blockchain',
    categoria: 'fundamentos',
    titulo: 'Blockchain',
    definicion:
      'Una cadena de bloques de datos enlazados criptográficamente. Cada bloque contiene transacciones y un "hash" del bloque anterior, formando una cadena imposible de alterar sin romper toda la secuencia.',
    analogia:
      'Como un cuaderno de contabilidad compartido entre miles de personas. Si alguien intenta borrar una entrada, todas las demás copias no van a coincidir y el fraude queda expuesto.',
    ejemplo:
      'Ethereum es una blockchain. Cuando mandás ETH a alguien, esa transacción queda grabada para siempre en la cadena, visible para cualquiera, sin que ningún banco la apruebe.',
    graficoId: 'GraficoBlockchain',
    relacionados: ['bloque', 'hash', 'inmutable', 'descentralizacion'],
  },
  {
    id: 'inmutable',
    categoria: 'fundamentos',
    titulo: 'Inmutabilidad',
    definicion:
      'Una vez que un dato se escribe en la blockchain, no puede modificarse ni borrarse. Ninguna persona, empresa ni gobierno puede cambiarlo.',
    analogia:
      'Como grabar tu nombre en cemento fresco. Una vez que seca, está ahí para siempre. No hay "editar" ni "deshacer".',
    ejemplo:
      'Si guardás el mensaje "Hola mundo" en el contrato RegistroInmutable, ese texto queda registrado eternamente en Sepolia, vinculado a tu address y al número de bloque en que se confirmó.',
    graficoId: 'GraficoBlockchain',
    relacionados: ['blockchain', 'bloque', 'hash'],
  },
  {
    id: 'descentralizacion',
    categoria: 'fundamentos',
    titulo: 'Descentralización',
    definicion:
      'No hay un servidor central que controle la red. Miles de computadoras (nodos) en todo el mundo tienen una copia idéntica de la blockchain y validan las transacciones juntas.',
    analogia:
      'Como Wikipedia, pero donde miles de servidores guardan la misma copia y para cambiar algo hay que convencer a la mayoría de ellos al mismo tiempo, algo casi imposible.',
    ejemplo:
      'Ethereum tiene más de 10.000 nodos activos. Si cierran 1.000, la red sigue funcionando igual. No tiene un "botón de apagado".',
    graficoId: 'GraficoRedes',
    relacionados: ['blockchain', 'consenso', 'ethereum'],
  },
  {
    id: 'consenso',
    categoria: 'fundamentos',
    titulo: 'Consenso',
    definicion:
      'El mecanismo por el que miles de nodos se ponen de acuerdo sobre cuál es la versión válida de la blockchain, sin necesitar un árbitro central.',
    analogia:
      'Como una votación en la que el 51% define la verdad. Ethereum usa "Proof of Stake": los validadores que apostaron ETH votan cuál bloque es legítimo.',
    ejemplo:
      'Cuando enviás una transacción, los validadores de Ethereum la incluyen en un bloque y lo propagan. Si la mayoría está de acuerdo, el bloque se confirma y tu tx queda grabada.',
    graficoId: 'GraficoCicloTx',
    relacionados: ['blockchain', 'descentralizacion', 'validar', 'bloque'],
  },
  {
    id: 'ethereum',
    categoria: 'fundamentos',
    titulo: 'Ethereum',
    definicion:
      'La blockchain más usada para aplicaciones descentralizadas. No es solo una moneda (ETH): es una computadora global que puede ejecutar código (smart contracts).',
    analogia:
      'Si Bitcoin es una calculadora que solo suma y resta, Ethereum es una computadora completa. Podés programarle reglas y ejecutarlas sin confiar en nadie.',
    ejemplo:
      'El contrato RegistroInmutable de esta demo corre en Ethereum (red Sepolia de pruebas). Cuando actualizás el mensaje, la EVM ejecuta el código del contrato.',
    graficoId: 'GraficoRedes',
    relacionados: ['EVM', 'smart-contract', 'mainnet', 'testnet', 'sepolia'],
  },
  {
    id: 'EVM',
    categoria: 'fundamentos',
    titulo: 'EVM (Ethereum Virtual Machine)',
    definicion:
      'La "computadora virtual" que corre dentro de cada nodo de Ethereum. Ejecuta el código de los smart contracts de forma idéntica en todos los nodos del mundo.',
    analogia:
      'Como Java y su JVM: el mismo código corre igual en Windows, Mac o Linux. La EVM garantiza que un smart contract se comporta igual en los 10.000+ nodos de Ethereum.',
    ejemplo:
      'Cuando llamás a actualizarMensaje(), la EVM ejecuta exactamente las mismas instrucciones en miles de nodos simultáneamente y todos llegan al mismo resultado.',
    graficoId: 'GraficoProviderSigner',
    relacionados: ['ethereum', 'smart-contract', 'bytecode'],
  },
  {
    id: 'mainnet',
    categoria: 'fundamentos',
    titulo: 'Mainnet',
    definicion:
      'La red principal de Ethereum, donde el ETH tiene valor real. Cada transacción aquí tiene un costo económico real.',
    analogia:
      'Es el mundo real. Como operar en la Bolsa de Valores con dinero real. Los errores cuestan plata.',
    ejemplo:
      'Si deployás un contrato en Mainnet y tiene un bug, podría costar miles de dólares en gas y/o pérdida de fondos. Por eso primero se prueba en testnets.',
    graficoId: 'GraficoRedes',
    relacionados: ['testnet', 'sepolia', 'gas', 'ether'],
  },
  {
    id: 'testnet',
    categoria: 'fundamentos',
    titulo: 'Testnet',
    definicion:
      'Una red de pruebas que funciona exactamente igual que Mainnet pero con ETH sin valor real. Perfecta para aprender y testear sin arriesgar dinero.',
    analogia:
      'El simulador de vuelo de un piloto. Todo funciona igual, pero si "estrellás el avión" no pasa nada.',
    ejemplo:
      'Esta demo usa Sepolia, la testnet oficial de Ethereum. Podés obtener ETH de prueba gratis en faucets y hacer todas las transacciones que quieras sin gastar nada real.',
    graficoId: 'GraficoRedes',
    relacionados: ['mainnet', 'sepolia', 'faucet'],
  },
  {
    id: 'sepolia',
    categoria: 'fundamentos',
    titulo: 'Sepolia',
    definicion:
      'La testnet recomendada de Ethereum para desarrollo en 2024-2025. Reemplazó a Ropsten y Rinkeby. El ETH aquí es gratis y no tiene valor.',
    analogia:
      'El patio trasero donde practicás antes del partido oficial. Mismas reglas, mismo código, pero sin consecuencias económicas.',
    ejemplo:
      'chainId de Sepolia: 0xaa36a7 (11155111 en decimal). Esta demo verifica que tu MetaMask esté en Sepolia antes de dejarte hacer transacciones.',
    graficoId: 'GraficoRedes',
    relacionados: ['testnet', 'mainnet', 'faucet', 'chainId'],
  },

  // ─── IDENTIDAD ─────────────────────────────────────────────────
  {
    id: 'wallet',
    categoria: 'identidad',
    titulo: 'Wallet (Billetera)',
    definicion:
      'Una aplicación que guarda tus claves criptográficas y te permite firmar transacciones. ¡Ojo! No guarda monedas: las monedas viven en la blockchain. La wallet guarda la llave para moverlas.',
    analogia:
      'No es una billetera que guarda billetes. Es más parecido a un llavero: guarda la llave que abre tu cuenta bancaria en la blockchain.',
    ejemplo:
      'MetaMask es una wallet. Cuando la instalás, genera una frase semilla de 12 palabras de la que derivan todas tus claves. Nunca la compartas con nadie.',
    graficoId: 'GraficoWallet',
    relacionados: ['address', 'clave-privada', 'seed-phrase', 'metamask', 'signer'],
  },
  {
    id: 'address',
    categoria: 'identidad',
    titulo: 'Address (Dirección)',
    definicion:
      'Tu "número de cuenta" en Ethereum. Es una cadena de 42 caracteres que empieza con 0x. Es pública: cualquiera puede enviarte ETH o contratos a tu address.',
    analogia:
      'Como tu CBU o número de cuenta bancaria. Podés dárselo a cualquiera para que te depositen. Solo vos podés retirar (con tu clave privada).',
    ejemplo:
      'Una address de ejemplo: 0x742d35Cc6634C0532925a3b8D4C8e8B9c7f3a1d2. Esta demo simula la address 0xDEM0...C4FE cuando conectás la wallet.',
    graficoId: 'GraficoWallet',
    relacionados: ['wallet', 'clave-privada', 'clave-publica'],
  },
  {
    id: 'clave-privada',
    categoria: 'identidad',
    titulo: 'Clave Privada',
    definicion:
      'Un número secreto de 256 bits (64 caracteres hex) que permite firmar transacciones. Si alguien la tiene, controla todos tus fondos. Nunca la compartas, ni con MetaMask, ni con nadie.',
    analogia:
      'La combinación de tu caja fuerte. Si alguien la sabe, puede sacar todo lo que hay adentro. No hay "recuperar contraseña".',
    ejemplo:
      'Ejemplo de clave privada (¡nunca uses esta!): 0x4c0883a69102937d6231471b5dbb6e538eba2ef9d9d4a8c1a9b26a9... La MetaMask la guarda cifrada en tu computadora.',
    graficoId: 'GraficoFirma',
    relacionados: ['wallet', 'clave-publica', 'seed-phrase', 'firma-digital'],
  },
  {
    id: 'clave-publica',
    categoria: 'identidad',
    titulo: 'Clave Pública',
    definicion:
      'Se deriva matemáticamente de la clave privada y se usa para que otros verifiquen tu firma. De la clave pública se deriva tu address. El proceso es unidireccional: se puede ir de privada a pública, pero no al revés.',
    analogia:
      'Como el candado de un buzón. Cualquiera puede ver el candado (clave pública) y meterle cartas. Solo el dueño de la llave (clave privada) puede abrir y sacar.',
    ejemplo:
      'Nadie necesita conocer tu clave pública directamente: Ethereum la usa internamente para verificar firmas. Vos solo ves tu address, que es un hash de la clave pública.',
    graficoId: 'GraficoFirma',
    relacionados: ['clave-privada', 'address', 'firma-digital'],
  },
  {
    id: 'seed-phrase',
    categoria: 'identidad',
    titulo: 'Seed Phrase (Frase Semilla)',
    definicion:
      '12 o 24 palabras en inglés que son el origen de todas tus claves. Con esta frase podés recuperar tu wallet en cualquier dispositivo. Si la perdés, perdés todo. Si alguien la ve, puede robarte todo.',
    analogia:
      'El master password de tu llavero. Si lo sabés, abrís todas las puertas. Escribila en papel, guardala en un lugar seguro, y nunca la escribas en ninguna app ni computadora.',
    ejemplo:
      'Ejemplo: "witch collapse practice feed shame open despair creek road again ice least". MetaMask genera esto cuando creás una cuenta nueva.',
    graficoId: 'GraficoWallet',
    relacionados: ['wallet', 'clave-privada', 'metamask'],
  },
  {
    id: 'firma-digital',
    categoria: 'identidad',
    titulo: 'Firma Digital',
    definicion:
      'Una prueba matemática de que vos (y solo vos) autorizaste una transacción. Se genera combinando los datos de la transacción con tu clave privada. Cualquiera puede verificarla sin conocer tu clave privada.',
    analogia:
      'Como firmar un cheque, pero imposible de falsificar. La firma prueba que el dueño de esa cuenta la autorizó. En digital, es matemáticamente verificable por cualquiera.',
    ejemplo:
      'Cuando clickeás "Firmar" en MetaMask, el browser manda los datos de la tx a MetaMask, que los firma con tu clave privada y devuelve la firma al contrato.',
    graficoId: 'GraficoFirma',
    relacionados: ['clave-privada', 'transaccion', 'wallet'],
  },
  {
    id: 'metamask',
    categoria: 'identidad',
    titulo: 'MetaMask',
    definicion:
      'La wallet más popular para navegadores (Chrome, Firefox, Brave). Es una extensión que inyecta el objeto window.ethereum en las páginas web, permitiendo a los dApps interactuar con la blockchain.',
    analogia:
      'El pasaporte digital de la Web3. Te identifica, guarda tus claves y firma las operaciones. Las apps Web3 lo detectan automáticamente.',
    ejemplo:
      'En esta demo, el código hace window.ethereum.request({ method: "eth_requestAccounts" }) para pedirle a MetaMask que muestre el popup de autorización.',
    graficoId: 'GraficoConectar',
    relacionados: ['wallet', 'provider', 'signer', 'firma-digital'],
  },

  // ─── SMART CONTRACTS ───────────────────────────────────────────
  {
    id: 'smart-contract',
    categoria: 'contratos',
    titulo: 'Smart Contract',
    definicion:
      'Un programa que vive en la blockchain y se ejecuta automáticamente cuando se cumplen las condiciones definidas. No necesita intermediarios, no puede censurarse y su código es público.',
    analogia:
      'Una máquina expendedora: metés monedas (condición), la máquina ejecuta el programa (entregarte el snack), sin necesitar a nadie en el medio.',
    ejemplo:
      'El contrato RegistroInmutable de esta demo tiene una regla simple: "si alguien llama a actualizarMensaje, guardá el texto y emitir un evento". Se ejecuta sola en la EVM.',
    graficoId: 'GraficoLeerVsEscribir',
    relacionados: ['ethereum', 'EVM', 'solidity', 'ABI', 'deploy'],
  },
  {
    id: 'solidity',
    categoria: 'contratos',
    titulo: 'Solidity',
    definicion:
      'El lenguaje de programación más usado para escribir smart contracts en Ethereum. Su sintaxis es similar a JavaScript/C++. Se compila a bytecode que corre en la EVM.',
    analogia:
      'Como JavaScript para la web: es el lenguaje que los devs usan para escribir la lógica de los contratos, aunque la EVM no entiende Solidity directamente sino su versión compilada.',
    ejemplo:
      'function actualizarMensaje(string memory _nuevo) public { mensaje = _nuevo; } — Esto es Solidity. Le dice a la EVM que guarde _nuevo en la variable mensaje.',
    graficoId: 'GraficoLeerVsEscribir',
    relacionados: ['smart-contract', 'EVM', 'bytecode', 'ABI', 'deploy'],
  },
  {
    id: 'ABI',
    categoria: 'contratos',
    titulo: 'ABI (Application Binary Interface)',
    definicion:
      'El "manual de instrucciones" del contrato. Es un JSON que describe qué funciones tiene el contrato, qué parámetros reciben y qué devuelven. Sin la ABI, el frontend no sabe cómo hablar con el contrato.',
    analogia:
      'Como el menú de un restaurante. Sin el menú, no sabés qué podés pedir ni cómo. El ABI le dice a Ethers.js: "este contrato tiene la función actualizarMensaje que recibe un string".',
    ejemplo:
      'El ABI de RegistroInmutable está en src/abi/RegistroInmutable.json. Ethers.js lo usa para saber cómo encodear la llamada a la función en bytes que entiende la EVM.',
    graficoId: 'GraficoProviderSigner',
    relacionados: ['smart-contract', 'solidity', 'bytecode', 'provider'],
  },
  {
    id: 'bytecode',
    categoria: 'contratos',
    titulo: 'Bytecode',
    definicion:
      'El código compilado del smart contract, en binario. Es lo que realmente se guarda en la blockchain y ejecuta la EVM. No es legible por humanos directamente.',
    analogia:
      'Como el código máquina de un programa. Vos escribís en Solidity (legible), el compilador lo convierte a bytecode (para la máquina). Remix hace esta compilación por vos.',
    ejemplo:
      'Cuando compilás RegistroInmutable.sol en Remix, genera un bytecode como 0x608060405234801561001057... Este es el código que se "deploya" en la blockchain.',
    graficoId: 'GraficoProviderSigner',
    relacionados: ['solidity', 'EVM', 'deploy', 'ABI'],
  },
  {
    id: 'deploy',
    categoria: 'contratos',
    titulo: 'Deploy (Despliegue)',
    definicion:
      'El proceso de publicar un smart contract en la blockchain por primera vez. Una vez deployado, el contrato vive en una address permanente y cualquiera puede interactuar con él.',
    analogia:
      'Como publicar una app en la App Store. Una vez publicada, tiene su propia dirección, es pública y no podés simplemente borrarla o editarla.',
    ejemplo:
      'En v1 de esta demo, vas a copiar el Solidity de RegistroInmutable en Remix, compilarlo y clickear Deploy. Remix te va a dar una address como 0x8bA3... que pegás en el .env.',
    graficoId: 'GraficoLeerVsEscribir',
    relacionados: ['smart-contract', 'bytecode', 'address', 'gas'],
  },

  // ─── TRANSACCIONES ─────────────────────────────────────────────
  {
    id: 'transaccion',
    categoria: 'transacciones',
    titulo: 'Transacción',
    definicion:
      'Cualquier operación que modifica el estado de la blockchain: enviar ETH, deployar un contrato, o llamar a una función que escribe datos. Requiere firma y pago de gas.',
    analogia:
      'Como una transferencia bancaria, pero entre computadoras sin banco. Vos la autorizás con tu firma digital, la red la procesa y queda grabada para siempre.',
    ejemplo:
      'Llamar a actualizarMensaje("Hola") es una transacción. Leer el valor actual de mensaje no lo es (es un "call" gratuito). La diferencia: si modifica la blockchain, es transacción.',
    graficoId: 'GraficoCicloTx',
    relacionados: ['firma-digital', 'gas', 'hash', 'bloque', 'nonce'],
  },
  {
    id: 'hash',
    categoria: 'transacciones',
    titulo: 'Hash (Identificador)',
    definicion:
      'Una huella digital única de 64 caracteres hexadecimales que identifica una transacción o bloque. Se genera aplicando una función matemática (SHA-3/Keccak-256) a los datos. Cualquier cambio mínimo produce un hash completamente diferente.',
    analogia:
      'Como el número de seguimiento de un paquete. Único, inmutable, te dice exactamente dónde está y qué pasó. En blockchain, además sirve para verificar que los datos no fueron alterados.',
    ejemplo:
      '0x4a8b2c1d9e3f... — Este es el formato de un hash de transacción. En la demo, al "confirmar" una tx simulada, se genera un hash fake con el mismo formato.',
    graficoId: 'GraficoBlockchain',
    relacionados: ['transaccion', 'bloque', 'inmutable'],
  },
  {
    id: 'bloque',
    categoria: 'transacciones',
    titulo: 'Bloque',
    definicion:
      'Un paquete que agrupa múltiples transacciones. Cada ~12 segundos, un validador de Ethereum agrupa transacciones pendientes en un bloque, lo firma y lo agrega a la cadena.',
    analogia:
      'Como una página de un libro contable. En esa página se registran todas las operaciones del período. Una vez llena y sellada, se archiva y se empieza la siguiente.',
    ejemplo:
      'Sepolia está en el bloque ~6.000.000. Cada bloque tiene un número incremental. Cuando tu tx queda en el bloque 6.001.234, eso significa que fue la ~12.000ava confirmación.',
    graficoId: 'GraficoBlockchain',
    relacionados: ['blockchain', 'hash', 'transaccion', 'validar', 'confirmacion'],
  },
  {
    id: 'nonce',
    categoria: 'transacciones',
    titulo: 'Nonce',
    definicion:
      'Un número que indica cuántas transacciones envió una address hasta ahora. Garantiza que las transacciones se procesen en orden y que no se puedan repetir (replay attack).',
    analogia:
      'Como el número de turno en una oficina. Si tu turno es el 15, antes tienen que pasar los turnos 1-14. No podés saltarlos ni repetir el mismo turno.',
    ejemplo:
      'Tu primera tx tiene nonce=0, la segunda nonce=1, etc. Si enviás una tx con nonce=5 pero ya usaste nonce=5, la red la rechaza como duplicada.',
    graficoId: 'GraficoCicloTx',
    relacionados: ['transaccion', 'address', 'firma-digital'],
  },
  {
    id: 'validar',
    categoria: 'transacciones',
    titulo: 'Validar / Minar',
    definicion:
      'El proceso por el que los nodos de la red verifican y confirman transacciones, agrupándolas en bloques. En Ethereum post-Merge se llama "validar" (antes "minar").',
    analogia:
      'Como un escribano que certifica documentos. Los validadores verifican que las firmas sean correctas, que haya suficiente gas y que el estado resultante sea válido.',
    ejemplo:
      'Cuando enviás una tx a Sepolia, primero queda en el "mempool" (lista de espera). Un validador la toma, la verifica, la incluye en un bloque y la broadcast a la red.',
    graficoId: 'GraficoCicloTx',
    relacionados: ['bloque', 'consenso', 'gas', 'confirmacion'],
  },
  {
    id: 'confirmacion',
    categoria: 'transacciones',
    titulo: 'Confirmación',
    definicion:
      'Una transacción está "confirmada" cuando fue incluida en un bloque. Cada nuevo bloque añadido encima aumenta las confirmaciones y hace la transacción más irreversible.',
    analogia:
      'Como que un cheque "limpie". A los 5 días bancarios está confirmado. En blockchain, con 1 confirmación ya es muy seguro, con 12 es prácticamente imposible de revertir.',
    ejemplo:
      'En esta demo, después de "firmar", la app espera 1 confirmación (tx.wait()). Eso tarda ~12 segundos en Sepolia. El narrador te avisa en cada etapa.',
    graficoId: 'GraficoCicloTx',
    relacionados: ['bloque', 'validar', 'transaccion'],
  },

  // ─── COSTOS ────────────────────────────────────────────────────
  {
    id: 'gas',
    categoria: 'costos',
    titulo: 'Gas',
    definicion:
      'Unidad que mide cuánto trabajo computacional cuesta ejecutar una operación en la blockchain. Cada instrucción de la EVM tiene un costo en gas. Pagás en ETH según el precio del gas del momento.',
    analogia:
      'La nafta de un auto. Cuanto más largo el viaje (operación), más nafta (gas) gastás. El precio de la nafta sube y baja según la demanda de la red.',
    ejemplo:
      'Guardar un mensaje corto gasta ~43.000 unidades de gas. Si el precio es 20 Gwei/unidad, la tarifa es 43.000 × 20 × 10⁻⁹ ETH ≈ 0.00086 ETH de prueba.',
    graficoId: 'GraficoGas',
    relacionados: ['gwei', 'wei', 'ether', 'transaccion', 'gas-fee'],
  },
  {
    id: 'gas-fee',
    categoria: 'costos',
    titulo: 'Gas Fee (Tarifa de Gas)',
    definicion:
      'El monto total en ETH que pagás por ejecutar una transacción. Se calcula como: gas usado × precio del gas. Va al validador que incluyó tu tx en un bloque.',
    analogia:
      'El precio del taxi: distancia recorrida (gas usado) × tarifa por km (precio del gas). Si hay mucho tráfico (red congestionada), la tarifa sube.',
    ejemplo:
      'En Sepolia, el gas es prácticamente gratis porque el ETH no vale nada. En Mainnet, en momentos de alta demanda puede llegar a $50-100 por transacción.',
    graficoId: 'GraficoGas',
    relacionados: ['gas', 'gwei', 'wei', 'transaccion'],
  },
  {
    id: 'ether',
    categoria: 'costos',
    titulo: 'Ether (ETH)',
    definicion:
      'La criptomoneda nativa de Ethereum. Se usa para pagar el gas de las transacciones. En Mainnet tiene valor de mercado real. En testnets como Sepolia es de juguete y se consigue gratis.',
    analogia:
      'El combustible de la máquina. Sin ETH no podés hacer transacciones, igual que sin nafta no podés manejar. Es también una moneda digital con valor propio.',
    ejemplo:
      '1 ETH = 1.000.000.000 Gwei = 10^18 Wei. Para esta demo en Sepolia, necesitás tener al menos 0.01 ETH de prueba (gratis del faucet) para hacer transacciones.',
    graficoId: 'GraficoGas',
    relacionados: ['gas', 'wei', 'gwei', 'faucet', 'mainnet'],
  },
  {
    id: 'wei',
    categoria: 'costos',
    titulo: 'Wei',
    definicion:
      'La unidad más pequeña de Ether. 1 ETH = 10^18 Wei (un quintillón). El código de los contratos trabaja internamente con Wei para mayor precisión.',
    analogia:
      'Como los centavos del peso, pero mucho más pequeños. Si 1 ETH fueran $1.000, 1 Wei serían $0,000000000000001. Se necesitan para representar fracciones muy pequeñas.',
    ejemplo:
      'Si querés mandar 0.001 ETH por código, en Ethers.js escribís ethers.parseEther("0.001") que convierte a 1000000000000000 Wei automáticamente.',
    graficoId: 'GraficoGas',
    relacionados: ['ether', 'gwei', 'gas'],
  },
  {
    id: 'gwei',
    categoria: 'costos',
    titulo: 'Gwei (Gigawei)',
    definicion:
      '1 Gwei = 10^9 Wei = 0.000000001 ETH. Es la unidad estándar para expresar el precio del gas porque resulta en números más manejables.',
    analogia:
      'Como hablar en centavos en vez de en pesos cuando el monto es muy pequeño. En vez de decir "0.000000020 ETH por gas", se dice "20 Gwei".',
    ejemplo:
      'El precio del gas en Sepolia suele ser 1-5 Gwei. En Mainnet durante congestión puede llegar a 100-500 Gwei.',
    graficoId: 'GraficoGas',
    relacionados: ['wei', 'ether', 'gas', 'gas-fee'],
  },
  {
    id: 'faucet',
    categoria: 'costos',
    titulo: 'Faucet (Canilla)',
    definicion:
      'Un servicio web que regala ETH de testnet gratis. Solo funciona con redes de prueba como Sepolia. Existente para que los devs puedan testear sin gastar dinero real.',
    analogia:
      'Como los chips gratis en un casino de práctica. Te dan fichas para jugar y aprender, pero no tienen valor fuera de esa mesa.',
    ejemplo:
      'sepoliafaucet.com te da 0.5 ETH de Sepolia por día. El Google Cloud Faucet es otra opción. Necesitás crear una cuenta y verificar que no sos un bot.',
    graficoId: 'GraficoRedes',
    relacionados: ['testnet', 'sepolia', 'ether'],
  },

  // ─── INFRAESTRUCTURA ───────────────────────────────────────────
  {
    id: 'provider',
    categoria: 'infraestructura',
    titulo: 'Provider',
    definicion:
      'Una conexión de solo lectura a la blockchain. Te permite leer datos (saldos, estado de contratos, transacciones) sin firmar nada. En Ethers.js: BrowserProvider o JsonRpcProvider.',
    analogia:
      'El lector de un libro. Puede ver todo el contenido pero no puede escribir en él. Para escribir necesitás el Signer.',
    ejemplo:
      'const provider = new ethers.BrowserProvider(window.ethereum) — Esto crea un provider usando MetaMask como puerta a la blockchain. Con él podés leer pero no firmar.',
    graficoId: 'GraficoProviderSigner',
    relacionados: ['signer', 'RPC', 'metamask', 'wallet'],
  },
  {
    id: 'signer',
    categoria: 'infraestructura',
    titulo: 'Signer (Firmante)',
    definicion:
      'Una extensión del Provider que tiene acceso a una clave privada y puede firmar transacciones. En Ethers.js se obtiene haciendo provider.getSigner().',
    analogia:
      'El lector más el bolígrafo. No solo puede ver el libro, también puede firmarlo. El Signer es quien autoriza las operaciones que cuestan gas.',
    ejemplo:
      'const signer = await provider.getSigner() — Esto le pide a MetaMask acceso a la clave privada de la cuenta activa para poder firmar transacciones.',
    graficoId: 'GraficoProviderSigner',
    relacionados: ['provider', 'wallet', 'firma-digital', 'transaccion'],
  },
  {
    id: 'RPC',
    categoria: 'infraestructura',
    titulo: 'RPC (Remote Procedure Call)',
    definicion:
      'El protocolo de comunicación entre tu app y un nodo de Ethereum. Tu código manda llamadas JSON-RPC a un nodo, que ejecuta las consultas y devuelve los resultados.',
    analogia:
      'El teléfono que conecta tu app con la blockchain. Hacés una "llamada" (eth_getBalance, eth_sendTransaction) y el nodo del otro lado responde.',
    ejemplo:
      'MetaMask incluye un nodo RPC de Infura internamente. También podés usar servicios como Alchemy o el nodo público de Sepolia: https://rpc.sepolia.org',
    graficoId: 'GraficoProviderSigner',
    relacionados: ['provider', 'chainId', 'metamask'],
  },
  {
    id: 'chainId',
    categoria: 'infraestructura',
    titulo: 'Chain ID',
    definicion:
      'Un número único que identifica cada red de Ethereum. Previene que una transacción firmada para una red se pueda usar en otra (replay attack entre redes).',
    analogia:
      'El código de área de un teléfono. El +54 es Argentina, el +1 es EEUU. El chainId 1 es Ethereum Mainnet, el 11155111 es Sepolia.',
    ejemplo:
      'Esta demo verifica que chainId === 0xaa36a7 (Sepolia). Si tenés MetaMask en Mainnet, la app te ofrece cambiar a Sepolia automáticamente.',
    graficoId: 'GraficoRedes',
    relacionados: ['testnet', 'mainnet', 'sepolia', 'RPC'],
  },
  {
    id: 'etherscan',
    categoria: 'infraestructura',
    titulo: 'Etherscan',
    definicion:
      'El explorador de bloques más popular para Ethereum. Una web donde podés buscar cualquier transacción, wallet, contrato o bloque y ver todos sus detalles públicamente.',
    analogia:
      'Como el rastreador de un paquete de correo, pero para transacciones. Cualquiera puede ver el estado de cualquier operación en la blockchain.',
    ejemplo:
      'sepolia.etherscan.io/tx/0x4a8b2c... — Esta URL te muestra todos los detalles de una transacción en Sepolia. En la demo, el link aparece tachado hasta que vayas a v1 con blockchain real.',
    graficoId: 'GraficoCicloTx',
    relacionados: ['transaccion', 'hash', 'bloque', 'address'],
  },
  {
    id: 'token',
    categoria: 'infraestructura',
    titulo: 'Token',
    definicion:
      'Un activo digital creado por un smart contract. A diferencia del ETH (nativo de Ethereum), los tokens son contratos que llevan su propio registro de saldos. Los más comunes siguen el estándar ERC-20.',
    analogia:
      'Las fichas del casino: las crea el casino (smart contract), tienen valor dentro del ecosistema, y el casino lleva el registro de quién tiene cuántas. El ETH sería el dinero real que usás para comprar fichas.',
    ejemplo:
      'USDC, DAI, UNI son tokens ERC-20 en Ethereum. Esta demo no usa tokens, solo guarda strings. Pero la infraestructura es la misma.',
    graficoId: 'GraficoProviderSigner',
    relacionados: ['smart-contract', 'ethereum', 'address'],
  },
];

// Índice por ID para búsqueda rápida O(1)
export const diccionarioPorId = Object.fromEntries(
  diccionario.map((t) => [t.id, t])
);

// Entradas agrupadas por categoría
export const diccionarioPorCategoria = diccionario.reduce((acc, termino) => {
  if (!acc[termino.categoria]) acc[termino.categoria] = [];
  acc[termino.categoria].push(termino);
  return acc;
}, {});
