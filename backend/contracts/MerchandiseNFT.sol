// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./libraries/RoyaltyEngine.sol";

contract MerchandiseNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using RoyaltyEngine for *;

    Counters.Counter private _tokenIds;

    enum MerchType { PHYSICAL, DIGITAL }

    struct Merchandise {
        address artist;
        MerchType merchType;
        uint256 price;
        uint256 royaltyFee;
        uint256 stock;
        bool isActive;
    }

    mapping(uint256 => Merchandise) public merchandise;
    mapping(address => uint256) public artistRoyalties;
    mapping(uint256 => mapping(address => string)) private _shippingDetails;

    event MerchMinted(uint256 indexed tokenId, address indexed artist, MerchType merchType);
    event MerchPurchased(uint256 indexed tokenId, address indexed buyer);
    event StockUpdated(uint256 indexed tokenId, uint256 newStock);

    error InvalidPrice();
    error InvalidRoyaltyFee();
    error InvalidStock();
    error InsufficientStock();
    error MerchNotActive();
    error InsufficientPayment();
    error NotMerchOwner();

    constructor() ERC721("AfrobeatsMerchNFT", "AFROMERCH") Ownable(msg.sender) {}

    function createMerchandise(
        string memory uri,
        MerchType merchType,
        uint256 price,
        uint256 royaltyFee,
        uint256 initialStock
    ) public returns (uint256) {
        if (price == 0) revert InvalidPrice();
        if (royaltyFee > 1000) revert InvalidRoyaltyFee();
        if (initialStock == 0) revert InvalidStock();

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _setTokenURI(newTokenId, uri);

        merchandise[newTokenId] = Merchandise({
            artist: msg.sender,
            merchType: merchType,
            price: price,
            royaltyFee: royaltyFee,
            stock: initialStock,
            isActive: true
        });

        emit MerchMinted(newTokenId, msg.sender, merchType);
        return newTokenId;
    }

    function purchaseMerchandise(
        uint256 tokenId,
        string memory shippingDetails
    ) public payable {
        Merchandise storage merch = merchandise[tokenId];
        if (!merch.isActive) revert MerchNotActive();
        if (merch.stock == 0) revert InsufficientStock();
        if (msg.value < merch.price) revert InsufficientPayment();

        uint256 royaltyAmount = RoyaltyEngine.calculateRoyalty(
            msg.value,
            merch.royaltyFee
        );
        uint256 sellerAmount = msg.value - royaltyAmount;

        artistRoyalties[merch.artist] += royaltyAmount;
        (bool success, ) = payable(merch.artist).call{value: sellerAmount}("");
        require(success, "Transfer to artist failed");

        merch.stock--;
        _safeMint(msg.sender, tokenId);

        if (merch.merchType == MerchType.PHYSICAL) {
            _shippingDetails[tokenId][msg.sender] = shippingDetails;
        }

        emit MerchPurchased(tokenId, msg.sender);
        emit StockUpdated(tokenId, merch.stock);
    }

    function updateStock(uint256 tokenId, uint256 newStock) public {
        if (merchandise[tokenId].artist != msg.sender) revert NotMerchOwner();
        merchandise[tokenId].stock = newStock;
        emit StockUpdated(tokenId, newStock);
    }

    function getShippingDetails(
        uint256 tokenId,
        address buyer
    ) public view returns (string memory) {
        require(
            merchandise[tokenId].artist == msg.sender ||
            buyer == msg.sender,
            "Not authorized"
        );
        return _shippingDetails[tokenId][buyer];
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
