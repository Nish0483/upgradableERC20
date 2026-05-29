// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./ERC20v1.sol";

/// @title ERC20v2
/// @notice ERC20v1 upgrade adding caller self-burn.
contract ERC20v2 is ERC20v1 {
    /// @notice Burns `amount` tokens from the caller's balance.
    /// @param amount Number of tokens to burn.
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
