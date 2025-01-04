// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library RoyaltyEngine {
    struct RoyaltyInfo {
        address recipient;
        uint256 amount;
    }

    error InvalidRoyaltyPercentage();
    error RoyaltyPaymentFailed();

    function calculateRoyalty(
        uint256 salePrice,
        uint256 royaltyPercentage
    ) internal pure returns (uint256) {
        if (royaltyPercentage > 10000) revert InvalidRoyaltyPercentage();
        return (salePrice * royaltyPercentage) / 10000;
    }

    function distributeRoyalties(
        RoyaltyInfo[] memory royalties
    ) internal {
        uint256 length = royalties.length;
        for (uint256 i = 0; i < length;) {
            (bool success, ) = royalties[i].recipient.call{
                value: royalties[i].amount
            }("");
            if (!success) revert RoyaltyPaymentFailed();
            unchecked { ++i; }
        }
    }
}
