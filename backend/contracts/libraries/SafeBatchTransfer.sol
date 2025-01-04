// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

library SafeBatchTransfer {
    error BatchTransferFailed();

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

    function batchSafeTransferFrom(
        IERC721 token,
        address from,
        address to,
        uint256[] calldata tokenIds
    ) internal {
        uint256 length = tokenIds.length;
        for (uint256 i = 0; i < length;) {
            token.safeTransferFrom(from, to, tokenIds[i]);
            unchecked { ++i; }
        }
    }
}
