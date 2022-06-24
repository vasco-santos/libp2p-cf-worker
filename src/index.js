/* eslint-env serviceworker */

import { createLibp2pNode } from './libp2p.js'

// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
/** @typedef {{ waitUntil(p: Promise): void }} Ctx */

export default {
  async fetch (request, env, ctx) {
    console.log('0 - request validated for websocket upgrade header')
    const upgradeHeader = request.headers.get('Upgrade')
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 })
    }

    console.log('1 - create websocket server')
    const webSocketPair = new WebSocketPair()
    const [client, server] = Object.values(webSocketPair)

    console.log('2 - libp2p node starting')
    const libp2p = await createLibp2pNode(env.LIBP2P_PRIVATE_KEY, server)
    console.log('3 - libp2p node started', libp2p.peerId.toString())

    server.accept()
    server.addEventListener('message', event => {
      console.log('received websocket message')
      console.log(event.data)
    })

    return new Response(null, {
      status: 101,
      webSocket: client,
    })
  }
}
