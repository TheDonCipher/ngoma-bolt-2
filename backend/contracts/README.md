# Smart Contracts Architecture

## Implementation Guide

### Contract Development

1. Base NFT Contract
```solidity
// contracts/base/BaseNFT.sol
abstract contract BaseNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor(string memory name, string memory symbol) 
        ERC721(name, symbol) 
        Ownable(msg.sender) {}
        
    function _mintToken(address to, string memory uri) internal returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        return newTokenId;
    }
}
```

2. Royalty Implementation
```solidity
// contracts/libraries/RoyaltyEngine.sol
library RoyaltyEngine {
    struct RoyaltyInfo {
        address recipient;
        uint256 amount;
    }
    
    function calculateRoyalty(uint256 salePrice, uint256 royaltyPercentage) 
        internal pure returns (uint256) {
        return (salePrice * royaltyPercentage) / 10000;
    }
}
```

### Security Patterns

1. Reentrancy Protection
```solidity
// contracts/security/ReentrancyGuard.sol
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;
    
    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}
```

2. Access Control
```solidity
// contracts/security/RoleManager.sol
abstract contract RoleManager {
    mapping(bytes32 => mapping(address => bool)) private _roles;
    
    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "RoleManager: unauthorized");
        _;
    }
    
    function hasRole(bytes32 role, address account) 
        public view returns (bool) {
        return _roles[role][account];
    }
}
```

### Gas Optimization

1. Batch Operations
```solidity
// contracts/libraries/SafeBatchTransfer.sol
library SafeBatchTransfer {
    function batchTransferFrom(
        IERC721 token,
        address from,
        address to,
        uint256[] calldata tokenIds
    ) internal {
        uint256 length = tokenIds.length;
        for (uint256 i = 0; i < length;) {
            token.transferFrom(from, to, tokenIds[i]);
            unchecked { ++i; }
        }
    }
}
```

2. Storage Optimization
```solidity
// contracts/libraries/PackedStorage.sol
library PackedStorage {
    struct PackedData {
        uint128 value1;
        uint128 value2;
    }
    
    function pack(uint128 v1, uint128 v2) 
        internal pure returns (PackedData memory) {
        return PackedData(v1, v2);
    }
}
```

### Testing Framework

1. Unit Testing
```solidity
// test/MusicNFT.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MusicNFT", function() {
    let musicNFT;
    let owner;
    let artist;
    
    beforeEach(async function() {
        const MusicNFT = await ethers.getContractFactory("MusicNFT");
        [owner, artist] = await ethers.getSigners();
        musicNFT = await MusicNFT.deploy();
        await musicNFT.deployed();
    });
    
    it("Should mint a new track", async function() {
        const tx = await musicNFT.mintTrack(
            "ipfs://metadata",
            ethers.utils.parseEther("0.1"),
            250 // 2.5% royalty
        );
        await tx.wait();
        expect(await musicNFT.ownerOf(1)).to.equal(owner.address);
    });
});
```

2. Integration Testing
```solidity
// test/integration/NFTEcosystem.test.ts
describe("NFT Ecosystem Integration", function() {
    it("Should handle track to album conversion", async function() {
        // Test interaction between MusicNFT and AlbumNFT
    });
});
```

### Deployment Process

1. Network Configuration
```typescript
// hardhat.config.ts
export default {
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
```

2. Deployment Script
```typescript
// scripts/deploy.ts
async function main() {
    // Deploy contracts in correct order
    const MusicNFT = await ethers.getContractFactory("MusicNFT");
    const musicNFT = await MusicNFT.deploy();
    await musicNFT.deployed();
    
    const AlbumNFT = await ethers.getContractFactory("AlbumNFT");
    const albumNFT = await AlbumNFT.deploy(musicNFT.address);
    await albumNFT.deployed();
    
    // Verify contracts
    await hre.run("verify:verify", {
        address: musicNFT.address,
        constructorArguments: [],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```
