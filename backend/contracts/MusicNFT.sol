// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./libraries/StringUtils.sol";
import "./libraries/RoyaltyEngine.sol";

contract MusicNFT is ERC721, ERC721URIStorage, Ownable, Pausable {
    using Counters for Counters.Counter;
    using StringUtils for string;
    using RoyaltyEngine for *;

    Counters.Counter private _tokenIds;

    struct Track {
        address artist;
        uint256 price;
        uint256 royaltyFee;
        bool isActive;
    }

    mapping(uint256 => Track) public tracks;
    mapping(address => uint256) public artistRoyalties;

    event TrackMinted(uint256 indexed tokenId, address indexed artist, string uri);
    event RoyaltyPaid(address indexed artist, uint256 amount);

    error InvalidRoyaltyFee();
    error TrackNotActive();
    error InsufficientPayment();
    error NoRoyaltiesToWithdraw();
    error NotTrackOwner();

    constructor() ERC721("AfrobeatsNFT", "AFRO") Ownable(msg.sender) {}

    // Pausable functionality
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mintTrack(
        string memory uri,
        uint256 price,
        uint256 royaltyFee
    ) public whenNotPaused returns (uint256) {
        if (royaltyFee > 1000) revert InvalidRoyaltyFee();
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);

        tracks[newTokenId] = Track({
            artist: msg.sender,
            price: price,
            royaltyFee: royaltyFee,
            isActive: true
        });

        emit TrackMinted(newTokenId, msg.sender, uri);
        return newTokenId;
    }

    function purchaseTrack(uint256 tokenId) public payable whenNotPaused {
        Track memory track = tracks[tokenId];
        if (!track.isActive) revert TrackNotActive();
        if (msg.value < track.price) revert InsufficientPayment();

        address owner = ownerOf(tokenId);
        uint256 royaltyAmount = RoyaltyEngine.calculateRoyalty(
            msg.value,
            track.royaltyFee
        );
        uint256 sellerAmount = msg.value - royaltyAmount;

        artistRoyalties[track.artist] += royaltyAmount;
        (bool success, ) = payable(owner).call{value: sellerAmount}("");
        require(success, "Transfer to owner failed");

        _transfer(owner, msg.sender, tokenId);
        emit RoyaltyPaid(track.artist, royaltyAmount);
    }

    function withdrawRoyalties() public whenNotPaused {
        uint256 amount = artistRoyalties[msg.sender];
        if (amount == 0) revert NoRoyaltiesToWithdraw();

        artistRoyalties[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Royalty transfer failed");
    }

    function setTrackPrice(uint256 tokenId, uint256 newPrice) public whenNotPaused {
        if (ownerOf(tokenId) != msg.sender) revert NotTrackOwner();
        tracks[tokenId].price = newPrice;
    }

    function toggleTrackActive(uint256 tokenId) public whenNotPaused {
        if (ownerOf(tokenId) != msg.sender) revert NotTrackOwner();
        tracks[tokenId].isActive = !tracks[tokenId].isActive;
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

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
