import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { EventsModule } from './events/events.module';
import { MerchandiseModule } from './merchandise/merchandise.module';
import { BadgesModule } from './badges/badges.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { WebsocketModule } from './websocket/websocket.module';
import { SearchModule } from './search/search.module';
import { NotificationModule } from './notification/notification.module';
import { AuditModule } from './audit/audit.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CacheModule,
    WebsocketModule,
    SearchModule,
    NotificationModule,
    AuditModule,
    EmailModule,
    AuthModule,
    UsersModule,
    TracksModule,
    AlbumsModule,
    EventsModule,
    MerchandiseModule,
    BadgesModule,
  ],
})
export class AppModule {}
