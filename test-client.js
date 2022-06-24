// 1 - base websockets

// import WebSocket from 'ws'

// const ws = new WebSocket('ws://127.0.0.1:8787')

// ws.on('open', function open() {
//   ws.send('something')
//   console.log('open')
// })

// 2 - libp2p websocket client

import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'

const libp2p = await createLibp2p({
  transports: [
    new WebSockets()
  ],
  streamMuxers: [new Mplex()],
  connectionEncryption: [new Noise()],
})

await libp2p.start()
console.log('libp2p node started', libp2p.peerId.toString())

console.log('dialing', '/ip4/127.0.0.1/tcp/8787/ws/p2p/12D3KooWKtiaFRueAoEsra3Y7MvDepxFpDESpwCiVuuXrDdib8Bt')
await libp2p.dial('/ip4/127.0.0.1/tcp/8787/ws/p2p/12D3KooWKtiaFRueAoEsra3Y7MvDepxFpDESpwCiVuuXrDdib8Bt')

console.log('successfully dialed')

await libp2p.stop()
