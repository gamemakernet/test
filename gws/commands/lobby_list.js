const { getLobbies } = require('../lobbies')

/**
 * @param {WebSocket} client
 */
exports.handler = (client) => {
  // Get the lobbies
  const lobbies = getLobbies()

  // Calculate the payload size
  const size = lobbies.reduce((size, lobby) => (size + lobby.name.length + 6), 0)

  // Write the response buffer
  const payload = Buffer.alloc(size)
  let offset = 0

  lobbies.forEach(lobby => {
    payload.writeUInt32LE(lobby.id, offset)
    offset += 4

    payload.write(lobby.name)
    offset += lobby.name.length

    payload.writeUInt8(lobby.players.length, offset++)

    payload.writeUInt8(lobby.maxPlayers, offset++)
  })

  // payload.forEach(byte => console.log(byte)) // log

  // Send the response
  client.send(payload)
}

/**
interface Response {
  id              u32
  name            string
  playersCount    u8
  maxPlayers      u8
*/
