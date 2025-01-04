// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MusicNFT.sol";
import "./libraries/SafeBatchTransfer.sol";
import "./libraries/RoyaltyEngine.sol";

contract AlbumNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeBatchTransfer for IERC721;
    using RoyaltyEngine for *;

    Counters.Counter private _tokenIds;

    struct Album {
        address artist;
        uint256[] trackTokenIds;
        uint256 price;
        uint256 royaltyFee;
        bool isActive;
    }

    MusicNFT public musicNFTContract;
    mapping(uint256 => Album) public albums;
    mapping(address => uint256) public artistRoyalties;

    event AlbumMinted(uint256 indexed tokenId, address indexed artist, string uri);
    event AlbumRoyaltyPaid(address indexed artist, uint256 amount);

    error InvalidRoyaltyFee();
    error NotTrackOwner();
    error AlbumNotActive();
    error InsufficientPayment();
    error NoRoyaltiesToWithdraw();
    error NotAlbumOwner();

    constructor(address _musicNFTAddress) ERC721("AfrobeatsAlbumNFT", "AFROALBUM") Ownable(msg.sender) {
        musicNFTContract = MusicNFT(_musicNFTAddress);
    }

    function mintAlbum(
        string memory uri,
        uint256[] memory trackTokenIds,
        uint256 price,
        uint256 royaltyFee
    ) public returns (uint256) {
        if (royaltyFee > 1000) revert InvalidRoyaltyFee();
        
        // Verify ownership of all tracks
        uint256 length = trackTokenIds.length;
        for (uint256 i = 0; i < length;) {
            if (musicNFTContract.ownerOf(trackTokenIds[i]) != msg.sender) {
                revert NotTrackOwner();
            }
            unchecked { ++i; }
        }

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);

        albums[newTokenId] = Album({
            artist: msg.sender,
            trackTokenIds: trackTokenIds,
            price: price,
            royaltyFee: royaltyFee,
            isActive: true
        });

        emit AlbumMinted(newTokenId, msg.sender, uri);
        return newTokenId;
    }

    function purchaseAlbum(uint256 tokenId) public payable {
        Album memory album = albums[tokenId];
        if (!album.isActive) revert AlbumNotActive();
        if (msg.value < album.price) revert InsufficientPayment();

        address owner = ownerOf(tokenId);
        uint256 royaltyAmount = RoyaltyEngine.calculateRoyalty(
            msg.value,
            album.royaltyFee
        );
        uint256 sellerAmount = msg.value - royaltyAmount;

        artistRoyalties[album.artist] += royaltyAmount;
        (bool success, ) = payable(owner).call{value: sellerAmount}("");
        require(success, "Transfer to owner failed");

        _transfer(owner, msg.sender, tokenId);
        emit AlbumRoyaltyPaid(album.artist, royaltyAmount);
    }

    function withdrawRoyalties() public {
        uint256 amount = artistRoyalties[msg.sender];
        if (amount == 0) revert NoRoyaltiesToWithdraw();

        artistRoyalties[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Royalty transfer failed");
    }

    function setAlbumPrice(uint256 tokenId, uint256 newPrice) public {
        if (ownerOf(tokenId) != msg.sender) revert NotAlbumOwner();
        albums[tokenId].price = newPrice;
    }

    function toggleAlbumActive(uint256 tokenId) public {
        if (ownerOf(tokenId) != msg.sender) revert NotAlbumOwner();
        albums[tokenId].isActive = !albums[tokenId].isActive;
    }

    function getAlbumTracks(uint256 tokenId) public view returns (uint256[] memory) {
        return albums[tokenId].trackTokenIds;
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
