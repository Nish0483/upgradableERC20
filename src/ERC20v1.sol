// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title ERC20v1
/// @notice UUPS-upgradeable ERC20 with owner-controlled minting.
contract ERC20v1 is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the token and mints 1M tokens to `initialOwner`.
    /// @param initialOwner Recipient of the initial supply and contract owner.
    function initialize(address initialOwner) public initializer {
        __ERC20_init("MyToken", "MTK");
        __Ownable_init(initialOwner);

        // Mint initial supply of 1 million tokens to the owner (18 decimals)
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }

    /// @notice Mints new tokens to `to`. Overridable in upgraded implementations.
    /// @param to Address receiving the minted tokens.
    /// @param amount Number of tokens to mint (18 decimals).
    function mint(address to, uint256 amount) external virtual onlyOwner {
        _mint(to, amount);
    }

    /// UUPSUpgradeable override function
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
