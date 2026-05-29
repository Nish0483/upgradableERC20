// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./ERC20v1.sol";

contract ERC20v2 is ERC20v1 {
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
