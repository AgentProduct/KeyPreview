import React, { useState, useEffect, useRef } from "react";
import {
  WebSocketTester,
  type WebSocketMessage,
  formatTimestamp,
  formatMessageContent,
} from "../modules/websocket";
import "./WebSocketTab.css";

const WebSocketTab: React.FC = () => {
  const [url, setUrl] = useState<string>("wss://echo.websocket.org");
  const [message, setMessage] = useState<string>("Hello WebSocket!");
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const messageHistoryRef = useRef<HTMLDivElement>(null);

  const wsTester = useRef<WebSocketTester>(new WebSocketTester());
  useEffect(() => {
    // Initialize WebSocket tester callbacks
    const tester = wsTester.current;

    tester.setOnMessageCallback((newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    tester.setOnStatusChangeCallback((isConnected) => {
      setConnected(isConnected);
    });

    return () => {
      // Clean up connection on unmount
      tester.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change, but only within the message history container
    if (messageHistoryRef.current) {
      messageHistoryRef.current.scrollTop = messageHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleConnect = async () => {
    if (connected) {
      // Disconnect
      try {
        setConnecting(true);
        wsTester.current.disconnect();
        setSuccess("已断开连接");
        setTimeout(() => setSuccess(""), 2000);
      } finally {
        // 短暂延迟以确保用户能看到loading状态
        setTimeout(() => setConnecting(false), 500);
      }
    } else {
      // Connect
      try {
        setError("");
        setConnecting(true);
        const success = await wsTester.current.connect(url);
        if (success) {
          setSuccess("连接成功");
          setTimeout(() => setSuccess(""), 2000);
        }
      } catch (err) {
        setError(
          `连接失败: ${err instanceof Error ? err.message : "未知错误"}`
        );
        setTimeout(() => setError(""), 3000);
      } finally {
        setConnecting(false);
      }
    }
  };

  const handleSend = () => {
    if (!message.trim()) {
      setError("消息不能为空");
      setTimeout(() => setError(""), 2000);
      return;
    }

    const success = wsTester.current.send(message);
    if (success) {
      setMessage(""); // Clear input after sending
    }
  };

  const handleClearMessages = () => {
    wsTester.current.clearMessages();
    setMessages([]);
    setSuccess("消息已清空");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="websocket-container">
      <div className="websocket-main">
        <div className="websocket-controls">
          <div className="option-group">
            <label>WebSocket地址：</label>
            <div className="url-input-group">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="wss://echo.websocket.org"
                className="url-input"
              />
              <button
                  className={`connect-btn ${connected ? "connected" : ""}`}
                  onClick={handleConnect}
                  disabled={connecting}
                >
                  {connecting ? (connected ? "⏳ 断开中..." : "⏳ 连接中...") : connected ? "🔌 断开连接" : "🔗 连接"}
                </button>
            </div>
          </div>

          <div className="option-group">
            <label>发送消息：</label>
            <div className="message-input-group">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入要发送的消息..."
                className="message-input"
                rows={3}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={!connected}
              >
                📤 发送
              </button>
            </div>
          </div>
        </div>

        <div className="message-history-container">
          <h3>消息记录</h3>
          <div className="message-history" ref={messageHistoryRef}>
            {messages.length === 0 ? (
              <div className="message-empty">暂无消息记录</div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message-item ${msg.type}`}>
                  <div className="message-header">
                    <span className="message-type">
                      {msg.type === "send" && "发送"}
                      {msg.type === "receive" && "接收"}
                      {msg.type === "error" && "错误"}
                      {msg.type === "system" && "系统"}
                    </span>
                    <span className="message-time">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <div className="message-content">
                    <pre>{formatMessageContent(msg.content)}</pre>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="message-actions">
            <button
              className="clear-btn"
              onClick={handleClearMessages}
              disabled={messages.length === 0}
            >
              🗑️ 清空消息
            </button>
          </div>
        </div>
      </div>

      <div className="websocket-info">
        <h3>WebSocket测试工具</h3>
        <div className="info-content">
          <p>
            WebSocket是一种用于H5浏览器的实时通讯协议，可以做到数据的实时推送，
            可适用于广泛的工作环境，例如客服系统、物联网数据传输系统。
          </p>
          <h4>使用说明：</h4>
          <ol>
            <li>填写WebSocket服务地址（支持wss协议）</li>
            <li>点击"连接"按钮建立连接</li>
            <li>在消息输入框中填写要发送的内容</li>
            <li>点击"发送"按钮或按Enter键发送消息</li>
            <li>消息记录区域会显示发送和接收的消息</li>
          </ol>
          <h4>测试地址：</h4>
          <p className="test-url">wss://echo.websocket.org</p>
        </div>
      </div>

      {error && (
        <div className="notification error">
          <span className="notification-icon">⚠️</span>
          <span className="notification-message">{error}</span>
        </div>
      )}
      {success && (
        <div className="notification success">
          <span className="notification-icon">✅</span>
          <span className="notification-message">{success}</span>
        </div>
      )}
    </div>
  );
};

export default WebSocketTab;
