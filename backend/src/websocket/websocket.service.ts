import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TransactionEvent, PriceFeed, UserNotification } from '@/lib/types/web3';

@Injectable()
export class WebsocketService {
  @WebSocketServer()
  private server: Server;

  emitTransaction(userId: string, transaction: TransactionEvent) {
    this.server
      .to(`transactions:${userId}`)
      .emit('transaction', transaction);
  }

  emitPriceUpdate(priceFeed: PriceFeed) {
    this.server.to('prices').emit('price', priceFeed);
  }

  emitNotification(userId: string, notification: UserNotification) {
    this.server
      .to(`notifications:${userId}`)
      .emit('notification', notification);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
