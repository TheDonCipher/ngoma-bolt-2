# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Elasticsearch 8+
- IPFS node (Infura/Pinata)
- Base Sepolia RPC access

## Environment Setup

1. Frontend (.env.local)
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_WS_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IPFS_PROJECT_ID=
NEXT_PUBLIC_IPFS_PROJECT_SECRET=

# Contract Addresses (Base Sepolia)
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=
NEXT_PUBLIC_ALBUM_NFT_CONTRACT_ADDRESS=
NEXT_PUBLIC_BADGE_NFT_CONTRACT_ADDRESS=
NEXT_PUBLIC_MERCHANDISE_NFT_CONTRACT_ADDRESS=
NEXT_PUBLIC_EVENT_TICKET_NFT_CONTRACT_ADDRESS=
```

2. Backend (.env)
```env
# Database
DATABASE_URL=

# Authentication
JWT_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Redis
REDIS_URL=

# Elasticsearch
ELASTICSEARCH_NODE=
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Admin
ADMIN_ADDRESSES=[]
```

## Deployment Steps

1. Smart Contracts
```bash
cd backend
npx hardhat compile
npx hardhat deploy --network base-sepolia
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS>
```

2. Backend API
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Start production server
npm run start:prod
```

3. Frontend
```bash
# Install dependencies
npm install

# Build application
npm run build

# Deploy to hosting service
npm run deploy
```

## Infrastructure Setup

1. Database
- Set up PostgreSQL with replication
- Configure automated backups
- Set up monitoring

2. Caching
- Configure Redis cluster
- Set up cache invalidation
- Monitor memory usage

3. Search
- Deploy Elasticsearch cluster
- Configure indices and mappings
- Set up data synchronization

4. File Storage
- Configure IPFS pinning service
- Set up CDN for static assets
- Implement backup strategy

## Monitoring & Maintenance

1. Health Checks
- API endpoints: /health
- Database connectivity
- Cache availability
- Search cluster status

2. Logging
- Application logs
- Access logs
- Error tracking
- Audit trail

3. Backups
- Database: Daily automated backups
- File storage: Regular IPFS pins
- Configuration: Version control

4. Security
- SSL/TLS certificates
- Firewall rules
- Rate limiting
- DDoS protection
