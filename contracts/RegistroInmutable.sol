// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RegistroInmutable
 * @notice Contrato simple para guardar un mensaje de texto en la blockchain.
 *         Una vez guardado, queda registrado para siempre. Nadie puede borrarlo.
 *
 * @dev Este es el contrato de la demo pedagógica de Web3.
 *      Para deployarlo, abrí remix.ethereum.org, pegá este código,
 *      compilá con Solidity 0.8.x y deployá en Sepolia Testnet.
 */
contract RegistroInmutable {

    // ─── VARIABLES DE ESTADO ────────────────────────────────────
    // Una variable de estado vive en la blockchain permanentemente.
    // La palabra "public" genera automáticamente una función getter
    // que cualquiera puede llamar para leer el valor (gratis).
    string public mensaje;

    // La dirección que deployó el contrato. "address" es un tipo
    // especial de Solidity para direcciones de Ethereum (20 bytes).
    address public owner;

    // ─── EVENTO ─────────────────────────────────────────────────
    // Los eventos son logs que se guardan en la blockchain pero no
    // en el estado del contrato. Son más baratos de emitir y útiles
    // para que el frontend "escuche" novedades.
    event MensajeActualizado(
        address indexed autor,   // indexed = se puede filtrar en búsquedas
        string nuevo,
        uint256 timestamp        // tiempo Unix en el que se ejecutó
    );

    // ─── CONSTRUCTOR ────────────────────────────────────────────
    // Se ejecuta UNA sola vez, cuando el contrato se deploya.
    // Después de eso, no se puede volver a llamar.
    constructor() {
        owner = msg.sender; // msg.sender = la address que está deployando
        mensaje = "";        // mensaje inicial vacío
    }

    // ─── FUNCIÓN DE ESCRITURA ────────────────────────────────────
    /**
     * @notice Actualiza el mensaje guardado en la blockchain.
     * @dev Esta función modifica el estado → requiere una transacción,
     *      firma del usuario y pago de gas.
     *      "memory" indica que el parámetro vive solo durante la ejecución.
     * @param _nuevo El nuevo mensaje a guardar. Máximo 200 caracteres recomendado.
     */
    function actualizarMensaje(string memory _nuevo) public {
        // Cualquiera puede llamar a esta función (no solo el owner).
        // Si quisieras restringirlo: require(msg.sender == owner, "No autorizado");

        require(bytes(_nuevo).length > 0, "El mensaje no puede estar vacio");
        require(bytes(_nuevo).length <= 500, "El mensaje es demasiado largo");

        mensaje = _nuevo;

        // Emitir el evento para que el frontend pueda reaccionar
        // block.timestamp = tiempo actual en segundos (Unix epoch)
        emit MensajeActualizado(msg.sender, _nuevo, block.timestamp);
    }

    /**
     * @notice Devuelve el mensaje actual. (Redundante con el getter público,
     *         pero útil como ejemplo de función de lectura explícita.)
     * @dev "view" = no modifica estado → gratuito, no requiere gas ni firma.
     */
    function leerMensaje() public view returns (string memory) {
        return mensaje;
    }
}
