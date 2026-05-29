// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

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

    // initilizer
    function initialize(address initialOwner) public initializer {
        __ERC20_init("MyToken", "MTK");
        __Ownable_init(initialOwner);

        // Mint initial supply of 1 million tokens to the owner (18 decimals)
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }

    // virtual modifier is needed for any function or states if we need to upgrade that in version 2
    function mint(address to, uint256 amount) external virtual onlyOwner {
        _mint(to, amount);
    }

    // Mandatory override function required by UUPS 
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
