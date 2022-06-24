import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'

import { createLibp2p } from 'libp2p'
import * as PeerId from '@libp2p/peer-id-factory'
import { keys } from '@libp2p/crypto'

import { WebSockets } from '@libp2p/websockets'
import { Mplex } from '@libp2p/mplex'
// import { Noise } from '@chainsafe/libp2p-noise'

/**
 * 
 * @param {string} privateKeyString 
 * @param {WebSocket} server 
 * @returns 
 */
export async function createLibp2pNode (privateKeyString, server) {
  /**
     * Error: Some functionality can only be performed while handling a request, such as
     * asynchronous I/O (fetch, Cache API, KV)
     * timeouts (setTimeout, setInterval)
     * generating random values (crypto.getRandomValues, crypto.subtle.generateKey)
     */
   const { Noise } = await import('@chainsafe/libp2p-noise')

   const privateKey = await keys.unmarshalPrivateKey(uint8ArrayFromString(privateKeyString, 'base64pad'))
   const peerId = await PeerId.createFromPrivKey(privateKey)

   const libp2p = await createLibp2p({
     peerId,
     transports: [
       new WebSockets()
     ],
     streamMuxers: [new Mplex()],
     connectionEncryption: [new Noise()],
   })

   await libp2p.start()

   return libp2p
}
