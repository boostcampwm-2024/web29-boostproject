// Monkey Patch로 WebSocket 생성자를 오버라이드
const OriginalWebSocket = window.WebSocket;

// @ts-expect-error Monkey Patch
window.WebSocket = function WebSocket(url, protocols) {
  const parsedUrl = new URL(url, window.location.href);

  if (parsedUrl.protocol === "http:") {
    parsedUrl.protocol = "ws:";
  } else if (parsedUrl.protocol === "https:") {
    parsedUrl.protocol = "wss:";
  }

  return new OriginalWebSocket(parsedUrl.href, protocols);
};

window.WebSocket.prototype = OriginalWebSocket.prototype;
