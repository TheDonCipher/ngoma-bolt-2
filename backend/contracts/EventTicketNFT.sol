// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./libraries/RoyaltyEngine.sol";

contract EventTicketNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using RoyaltyEngine for *;

    Counters.Counter private _eventIds;
    Counters.Counter private _ticketIds;

    enum EventType { VIRTUAL, PHYSICAL, HYBRID }

    struct Event {
        address organizer;
        EventType eventType;
        uint256 startTime;
        uint256 endTime;
        uint256 basePrice;
        uint256 maxAttendees;
        uint256 ticketsSold;
        bool isActive;
    }

    struct Ticket {
        uint256 eventId;
        uint256 price;
        bool isUsed;
        string accessKey;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => mapping(address => bool)) public eventAttendees;

    event EventCreated(uint256 indexed eventId, address indexed organizer, EventType eventType);
    event TicketPurchased(uint256 indexed ticketId, uint256 indexed eventId, address indexed buyer);
    event TicketUsed(uint256 indexed ticketId, uint256 indexed eventId, address indexed attendee);

    error InvalidEventTimes();
    error InvalidPrice();
    error InvalidMaxAttendees();
    error EventNotActive();
    error EventFull();
    error InsufficientPayment();
    error TicketAlreadyUsed();
    error NotTicketOwner();
    error EventNotStarted();
    error EventEnded();

    constructor() ERC721("AfrobeatsEventNFT", "AFROEVENT") Ownable(msg.sender) {}

    function createEvent(
        string memory uri,
        EventType eventType,
        uint256 startTime,
        uint256 endTime,
        uint256 basePrice,
        uint256 maxAttendees
    ) public returns (uint256) {
        if (startTime >= endTime) revert InvalidEventTimes();
        if (basePrice == 0) revert InvalidPrice();
        if (maxAttendees == 0) revert InvalidMaxAttendees();

        _eventIds.increment();
        uint256 newEventId = _eventIds.current();

        events[newEventId] = Event({
            organizer: msg.sender,
            eventType: eventType,
            startTime: startTime,
            endTime: endTime,
            basePrice: basePrice,
            maxAttendees: maxAttendees,
            ticketsSold: 0,
            isActive: true
        });

        _setTokenURI(newEventId, uri);
        emit EventCreated(newEventId, msg.sender, eventType);
        return newEventId;
    }

    function purchaseTicket(uint256 eventId) public payable returns (uint256) {
        Event storage eventDetails = events[eventId];
        if (!eventDetails.isActive) revert EventNotActive();
        if (eventDetails.ticketsSold >= eventDetails.maxAttendees) revert EventFull();
        if (msg.value < eventDetails.basePrice) revert InsufficientPayment();

        _ticketIds.increment();
        uint256 newTicketId = _ticketIds.current();

        tickets[newTicketId] = Ticket({
            eventId: eventId,
            price: msg.value,
            isUsed: false,
            accessKey: ""
        });

        eventDetails.ticketsSold++;
        _safeMint(msg.sender, newTicketId);

        (bool success, ) = payable(eventDetails.organizer).call{value: msg.value}("");
        require(success, "Transfer to organizer failed");

        emit TicketPurchased(newTicketId, eventId, msg.sender);
        return newTicketId;
    }

    function useTicket(uint256 ticketId) public {
        if (ownerOf(ticketId) != msg.sender) revert NotTicketOwner();
        
        Ticket storage ticket = tickets[ticketId];
        Event storage eventDetails = events[ticket.eventId];
        
        if (ticket.isUsed) revert TicketAlreadyUsed();
        if (block.timestamp < eventDetails.startTime) revert EventNotStarted();
        if (block.timestamp > eventDetails.endTime) revert EventEnded();

        ticket.isUsed = true;
        eventAttendees[ticket.eventId][msg.sender] = true;

        // Generate access key for virtual events
        if (eventDetails.eventType != EventType.PHYSICAL) {
            ticket.accessKey = _generateAccessKey(ticketId, msg.sender);
        }

        emit TicketUsed(ticketId, ticket.eventId, msg.sender);
    }

    function _generateAccessKey(
        uint256 ticketId,
        address attendee
    ) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                bytes32(abi.encodePacked(ticketId, attendee))
            )
        );
    }

    function getAccessKey(uint256 ticketId) public view returns (string memory) {
        require(
            ownerOf(ticketId) == msg.sender ||
            events[tickets[ticketId].eventId].organizer == msg.sender,
            "Not authorized"
        );
        return tickets[ticketId].accessKey;
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
