const port = 8081

const {Prisma: PrismaInstance} = require('./prisma/Prisma.js');
const {WebBroker : WebSocketInstance} = require('./WebSocket/WebSocket.js');

const Prisma = PrismaInstance.getInstance()
await Prisma.connect();
const WebSocket = WebSocketInstance.getInstance();
WebSocket.connect(port)

console.log(`sever js is working`);

