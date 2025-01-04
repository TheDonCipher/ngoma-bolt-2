import { Module } from '@nestjs/common';
import { MerchandiseController } from './merchandise.controller';
import { MerchandiseService } from './merchandise.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [PrismaModule, CacheModule, WebsocketModule],
  controllers: [MerchandiseController],
  providers: [MerchandiseService],
  exports: [MerchandiseService],
})
export class MerchandiseModule {}
