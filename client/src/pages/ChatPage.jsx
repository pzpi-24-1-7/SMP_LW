// ChatPage.jsx
import { useState, useEffect, useRef, useCallback } from 'react';

const GLOBAL_ROOM = 'global';

function getDmRoomId(me, other) {
    return 'dm:' + [me, other].sort().join(':');
}

const ChatPage = () => {
    const [messages, setMessages] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState('');

    const [isUsernameSet, setIsUsernameSet] = useState(false);

    const [activeRoom, setActiveRoom] = useState(GLOBAL_ROOM);

    const [otherUsers, setOtherUsers] = useState([]);

    const [unread, setUnread] = useState({});
    const [usernameError, setUsernameError] = useState('');

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const activeRoomRef = useRef(GLOBAL_ROOM);

    const addMessage = useCallback((roomId, msg) => {
        setMessages(prev => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), msg]
        }));
    }, []);

    useEffect(() => {
        if (!isUsernameSet) {
          return
        };

        const ws = new WebSocket('ws://localhost:8080');

        socketRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            ws.send(JSON.stringify({ type: 'setUsername', username }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'userList') {
                    setOtherUsers(data.users.filter(u => u !== username));
                } else if (data.type === 'message' || data.type === 'system') {
                    const roomId = data.room || GLOBAL_ROOM;
                    addMessage(roomId, data);

                    if (activeRoomRef.current !== roomId) {
                        setUnread(u => ({ ...u, [roomId]: (u[roomId] || 0) + 1 }));
                    }
                } else if (data.type === 'error') {
                    setUsernameError(data.text);
                    setIsUsernameSet(false);
                    ws.close();
                }
            } catch (e) {
                console.error('Parse error:', e);
            }
        };

        ws.onerror = () => setIsConnected(false);
        ws.onclose = () => setIsConnected(false);

        return () => ws.close();
    }, [isUsernameSet, username, addMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeRoom]);

    const switchRoom = (roomId) => {
        setActiveRoom(roomId);
        activeRoomRef.current = roomId;
        setUnread(u => ({ ...u, [roomId]: 0 }));
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        
        if (!inputValue.trim() || !isConnected || !socketRef.current) return;

        socketRef.current.send(JSON.stringify({
            type: 'message',
            text: inputValue,
            room: activeRoom
        }));
        setInputValue('');
    };

    const handleSetUsername = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setUsernameError('');
            setIsUsernameSet(true);
        }
    };

    const getRoomDisplayName = (roomId) => {
        if (roomId === GLOBAL_ROOM) {
          return ' Загальний чат';
        }

        const other = roomId.split(':').find(p => p !== 'dm' && p !== username);

        return `@ ${other}`;
    };

    const currentMessages = messages[activeRoom] || [];

    if (!isUsernameSet) {
        return (
            <div className="chat-container">
                <div className="username-form">
                    <h2>Введіть ваше ім'я</h2>
                    {usernameError && <p className="chat-error">{usernameError}</p>}
                    <form onSubmit={handleSetUsername}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ваше ім'я..."
                            autoFocus
                            required
                        />
                        <button type="submit">Увійти в чат</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <aside className="chat-sidebar">
                <div className="sidebar-profile">
                    <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
                    <span className="sidebar-username">{username}</span>
                </div>

                <div className="sidebar-section-label">Канали</div>
                <button
                    className={`room-item ${activeRoom === GLOBAL_ROOM ? 'active' : ''}`}
                    onClick={() => switchRoom(GLOBAL_ROOM)}
                >
                    <span>Загальний</span>
                    {unread[GLOBAL_ROOM] > 0 && (
                        <span className="unread-badge">{unread[GLOBAL_ROOM]}</span>
                    )}
                </button>

                <div className="sidebar-section-label">Онлайн ({otherUsers.length})</div>
                <div className="user-list">
                    {otherUsers.map(user => {
                        const roomId = getDmRoomId(username, user);
                        return (
                            <button
                                key={user}
                                className={`user-item ${activeRoom === roomId ? 'active' : ''}`}
                                onClick={() => switchRoom(roomId)}
                            >
                                <span className="user-dot" />
                                <span>{user}</span>
                                {unread[roomId] > 0 && (
                                    <span className="unread-badge">{unread[roomId]}</span>
                                )}
                            </button>
                        );
                    })}
                    {otherUsers.length === 0 && (
                        <p className="no-users">—</p>
                    )}
                </div>
            </aside>

            <div className="chat-main">
                <div className="chat-header">
                    <h2>{getRoomDisplayName(activeRoom)}</h2>
                    <div className="connection-status">
                        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
                        {isConnected ? 'Онлайн' : 'Офлайн'}
                    </div>
                </div>

                <div className="messages-area">
                    {currentMessages.length === 0 ? (
                        <div className="empty-messages">
                            <p>Немає повідомлень. Почніть розмову!</p>
                        </div>
                    ) : (
                        currentMessages.map((msg, index) => {
                            if (msg.type === 'system') {
                                return (
                                    <div key={index} className="system-message">
                                        {msg.text}
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={index}
                                    className={`message ${msg.username === username ? 'own-message' : 'other-message'}`}
                                >
                                    <div className="message-header">
                                        <span className="message-username">{msg.username}</span>
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString('uk-UA')}
                                        </span>
                                    </div>
                                    <div className="message-text">{msg.text}</div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="message-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Повідомлення в ${getRoomDisplayName(activeRoom)}...`}
                        disabled={!isConnected}
                    />
                    <button type="submit" disabled={!isConnected || !inputValue.trim()}>
                        Відправити
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
