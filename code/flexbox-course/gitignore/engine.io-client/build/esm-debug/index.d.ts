import { Socket } from "./socket.js";
export { Socket };
export { SocketOptions, SocketWithoutUpgrade, SocketWithUpgrade, } from "./socket.js";
export declare const protocol: number;
export { Transport, TransportError } from "./transport.js";
export { transports } from "./transports/index.js";
export { installTimerFunctions } from "./util.js";
export { parse } from "./contrib/parseuri.js";
export { nextTick } from "./globals.node.js";
export { Fetch } from "./transports/polling-fetch.js";
export { XHR as NodeXHR } from "./transports/polling-xhr.node.js";
export { XHR } from "./transports/polling-xhr.js";
export { WS as NodeWebSocket } from "./transports/websocket.node.js";
export { WS as WebSocket } from "./transports/websocket.js";
export { WT as WebTransport } from "./transports/webtransport.js";
