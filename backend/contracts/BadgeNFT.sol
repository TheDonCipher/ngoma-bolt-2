// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BadgeNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum BadgeType { COLLECTOR, LISTENER, SPECIAL }
    enum BadgeLevel { BRONZE, SILVER, GOLD, PLATINUM, EXCLUSIVE }

    struct Badge {
        BadgeType badgeType;
        BadgeLevel level;
        uint256 threshold;
        bool isActive;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => mapping(BadgeType => uint256)) public userProgress;
    mapping(address => mapping(uint256 => bool)) public earnedBadges;

    event BadgeEarned(address indexed user, uint256 indexed badgeId, BadgeType badgeType, BadgeLevel level);
    event ProgressUpdated(address indexed user, BadgeType badgeType, uint256 newProgress);

    error InvalidThreshold();
    error BadgeNotActive();
    error BadgeAlreadyEarned();
    error ThresholdNotMet();

    constructor() ERC721("AfrobeatsBadgeNFT", "AFROBADGE") Ownable(msg.sender) {}

    function createBadge(
        BadgeType badgeType,
        BadgeLevel level,
        uint256 threshold,
        string memory uri
    ) public onlyOwner returns (uint256) {
        if (threshold == 0) revert InvalidThreshold();

        _tokenIds.increment();
        uint256 newBadgeId = _tokenIds.current();

        badges[newBadgeId] = Badge({
            badgeType: badgeType,
            level: level,
            threshold: threshold,
            isActive: true
        });

        _setTokenURI(newBadgeId, uri);
        return newBadgeId;
    }

    function updateProgress(
        address user,
        BadgeType badgeType,
        uint256 amount
    ) public onlyOwner {
        userProgress[user][badgeType] += amount;
        emit ProgressUpdated(user, badgeType, userProgress[user][badgeType]);

        // Check for eligible badges
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            Badge memory badge = badges[i];
            if (badge.badgeType == badgeType &&
                badge.isActive &&
                !earnedBadges[user][i] &&
                userProgress[user][badgeType] >= badge.threshold) {
                _mintBadge(user, i);
            }
        }
    }

    function _mintBadge(address user, uint256 badgeId) internal {
        Badge memory badge = badges[badgeId];
        if (!badge.isActive) revert BadgeNotActive();
        if (earnedBadges[user][badgeId]) revert BadgeAlreadyEarned();
        if (userProgress[user][badge.badgeType] < badge.threshold) revert ThresholdNotMet();

        _safeMint(user, badgeId);
        earnedBadges[user][badgeId] = true;

        emit BadgeEarned(user, badgeId, badge.badgeType, badge.level);
    }

    function getUserProgress(
        address user,
        BadgeType badgeType
    ) public view returns (uint256) {
        return userProgress[user][badgeType];
    }

    function hasBadge(
        address user,
        uint256 badgeId
    ) public view returns (bool) {
        return earnedBadges[user][badgeId];
    }

    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage)
        returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage)
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
