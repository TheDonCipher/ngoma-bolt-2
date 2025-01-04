# Backend API Structure

## Implementation Guide

### API Architecture

1. Controller Pattern
```typescript
// src/albums/albums.controller.ts
@Controller('albums')
export class AlbumsController {
  @Post('mint')
  async mintAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.mintAlbumNFT(createAlbumDto);
  }
}
```

2. Service Layer
```typescript
// src/albums/albums.service.ts
@Injectable()
export class AlbumsService {
  async mintAlbumNFT(album: Album): Promise<string> {
    // Implementation for minting album NFT
  }
}
```

### Database Integration

1. Prisma Schema
```prisma
// prisma/schema.prisma
model Album {
  id        String   @id @default(cuid())
  title     String
  artist    User     @relation(fields: [artistId], references: [id])
  artistId  String
  tracks    Track[]
  nft       NFT?
}
```

2. Repository Pattern
```typescript
// src/albums/albums.repository.ts
@Injectable()
export class AlbumsRepository {
  async findById(id: string): Promise<Album | null> {
    return this.prisma.album.findUnique({
      where: { id },
      include: { tracks: true },
    });
  }
}
```

### Web3 Integration

1. Contract Interaction
```typescript
// src/web3/contract.service.ts
@Injectable()
export class ContractService {
  async mintNFT(metadata: NFTMetadata): Promise<string> {
    const contract = new ethers.Contract(address, abi, signer);
    const tx = await contract.mint(metadata);
    return tx.hash;
  }
}
```

2. Transaction Handling
```typescript
// src/web3/transaction.service.ts
@Injectable()
export class TransactionService {
  async waitForTransaction(hash: string): Promise<void> {
    await this.provider.waitForTransaction(hash);
    // Handle transaction completion
  }
}
```

### Caching Strategy

1. Redis Implementation
```typescript
// src/cache/cache.service.ts
@Injectable()
export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
}
```

2. Cache Interceptor
```typescript
// src/cache/cache.interceptor.ts
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    // Cache handling logic
  }
}
```

### WebSocket Implementation

1. Gateway Setup
```typescript
// src/websocket/websocket.gateway.ts
@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Handle new connections
  }
}
```

2. Event Handling
```typescript
// src/websocket/websocket.service.ts
@Injectable()
export class WebsocketService {
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
```

### Security Implementation

1. Authentication Guard
```typescript
// src/auth/jwt.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    // JWT validation logic
  }
}
```

2. Rate Limiting
```typescript
// src/common/guards/rate-limiter.guard.ts
@Injectable()
export class RateLimiterGuard implements CanActivate {
  private rateLimiter: RateLimiterMemory;
  
  async canActivate(context: ExecutionContext) {
    // Rate limiting logic
  }
}
```

### Testing Strategy

1. Unit Tests
```typescript
// src/albums/albums.service.spec.ts
describe('AlbumsService', () => {
  it('should mint album NFT', async () => {
    const result = await service.mintAlbumNFT(mockAlbum);
    expect(result).toBeDefined();
  });
});
```

2. E2E Tests
```typescript
// test/albums.e2e-spec.ts
describe('Albums E2E', () => {
  it('should create album', () => {
    return request(app.getHttpServer())
      .post('/albums')
      .send(createAlbumDto)
      .expect(201);
  });
});
```

### Deployment Configuration

1. Environment Setup
```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/db"
JWT_SECRET="your-secret-key"
REDIS_URL="redis://localhost:6379"
```

2. Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```
