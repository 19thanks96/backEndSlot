const {Prisma: PrismaInstance} = require('./api/Prisma.js');
const {WebBroker : WebSocketInstance} = require('./WebSocket/WebSocket.js');
const RedisClient = require('./redis/Redis.js');

const Redis = RedisClient.getInstance();
const Prisma = PrismaInstance.getInstance()
Prisma.connect();
const WebSocket = WebSocketInstance.getInstance();
WebSocket.connect()