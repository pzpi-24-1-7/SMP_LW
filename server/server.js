require('dotenv').config();
const express = require('express');
const cors = require('cors');
const lotRoutes = require('./routes/lotRoutes');
const { connectDatabase, disconnectDatabase } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const { WebSocketServer } = require('ws');
const WS_PORT = parseInt(process.env.WS_PORT || 8080);

const wss = new WebSocketServer({ port: WS_PORT });

const clients = new Map();

function getUsernames() {
    return Array.from(clients.values()).map(c => c.username);
}

function broadcast(data) {
    const message = JSON.stringify(data);

    wss.clients.forEach(ws => {
        if (ws.readyState === ws.OPEN) {
            ws.send(message);
        }
    });
}

wss.on('listening', () => {
    console.log(`WebSocket Server on ${WS_PORT}`)
});

wss.on('connection', function (ws) {
    ws.on('error', () => {
        console.error;
    });

    ws.on('message', function (data) {
        let jsonData;

        try { 
            jsonData = JSON.parse(data); 
        } catch { 
            return; 
        }

        if (jsonData.type === 'setUsername') {
            const username = String(jsonData.username || '').trim().slice(0, 32);
            
            if (!username) {
                return;
            }

            const taken = Array.from(clients.values()).some(c => c.username === username);

            if (taken) {
                ws.send(JSON.stringify({ type: 'error', text: 'Це ім\'я вже зайнято' }));
                return;
            }

            clients.set(ws, { username });

            ws.send(JSON.stringify({ type: 'userList', users: getUsernames() }));

            broadcast({
                type: 'system',
                text: `${username} приєднався до чату`,
                room: 'global',
                timestamp: new Date().toISOString()
            });

            broadcast({ type: 'userList', users: getUsernames() });

            return;
        }

        const clientInfo = clients.get(ws);

        if (!clientInfo) {
            return;
        }

        if (jsonData.type === 'message') {
            const text = String(jsonData.text || '').trim();
            if (!text) {
                return;
            }

            const room = String(jsonData.room || 'global');

            const message = {
                type: 'message',
                username: clientInfo.username,
                text,
                room,
                timestamp: new Date().toISOString()
            };

            if (room === 'global') {
                broadcast(message);
            } else if (room.startsWith('dm:')) {
                // room format: dm:userA:userB  (sorted alphabetically)
                const parts = room.split(':');

                if (parts.length === 3) {
                    const [, u1, u2] = parts;
                    const messageStr = JSON.stringify(message);

                    for (const [wsClient, info] of clients) {
                        if ((info.username === u1 || info.username === u2) && wsClient.readyState === wsClient.OPEN) {
                            wsClient.send(messageStr);
                        }
                    }
                }
            }
        }
    });

    ws.on('close', function () {
        const clientInfo = clients.get(ws);
        if (clientInfo) {
            const { username } = clientInfo;
            clients.delete(ws);
            broadcast({
                type: 'system',
                text: `${username} покинув чат`,
                room: 'global',
                timestamp: new Date().toISOString()
            });
            broadcast({ type: 'userList', users: getUsernames() });
        }
    });
});

app.use(cors());
app.use(express.json());
app.use('/api/lots', lotRoutes);

async function startServer() {
    await connectDatabase();

    const server = app.listen(PORT, () => {
        console.log(`Running on http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
        console.log(`${signal} received, shutting down...`);
        server.close(async () => {
            wss.close();
            await disconnectDatabase();
            process.exit(0);
        });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
