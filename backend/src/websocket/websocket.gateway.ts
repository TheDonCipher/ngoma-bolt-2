import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { verifyToken } from '../common/utils/jwt.util';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(WebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketService: WebsocketService) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new Error('No token provided');
      }

      const decoded = await verifyToken(token);
      client.data.userId = decoded.sub;
      client.join(`user:${decoded.sub}`);

      this.logger.log(`Client connected: ${client.id}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe:transactions')
  handleTransactionSubscription(client: Socket) {
    client.join(`transactions:${client.data.userId}`);
    return { event: 'subscribed', data: 'transactions' };
  }

  @SubscribeMessage('subscribe:prices')
  handlePriceSubscription(client: Socket) {
    client.join('prices');
    return { event: 'subscribed', data: 'prices' };
  }

  @SubscribeMessage('subscribe:notifications')
  handleNotificationSubscription(client: Socket) {
    client.join(`notifications:${client.data.userId}`);
    return { event: 'subscribed', data: 'notifications' };
  }
}
