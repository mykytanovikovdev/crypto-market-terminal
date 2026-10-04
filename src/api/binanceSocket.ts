// Public Binance market-data WebSocket — no auth required.
// Docs: https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams
import type { TickerUpdate } from '../types/market';

export function subscribeTicker(symbols: string[], onTick: (t: TickerUpdate) => void): () => void {
  const streams = symbols.map((s) => `${s.toLowerCase()}@trade`).join('/');
  const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const d = msg.data;
    if (d?.s && d?.p) {
      onTick({ symbol: d.s, price: parseFloat(d.p) });
    }
  };

  // Caller should invoke the returned function on unmount to avoid leaked sockets.
  return () => ws.close();
}
