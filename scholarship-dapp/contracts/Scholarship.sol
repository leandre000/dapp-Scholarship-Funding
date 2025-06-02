// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Scholarship {
    address public admin;
    mapping(address => bool) public applicants;
    uint256 public totalDonations;

    event Donated(address indexed donor, uint256 amount);
    event Applied(address indexed applicant);
    event FundsReleased(address indexed recipient, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        totalDonations += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    function applyForScholarship() public {
        require(!applicants[msg.sender], "Already applied");
        applicants[msg.sender] = true;
        emit Applied(msg.sender);
    }

    function releaseFunds(address payable recipient, uint256 amount) public {
        require(msg.sender == admin, "Only admin can release funds");
        require(address(this).balance >= amount, "Insufficient balance");
        recipient.transfer(amount);
        emit FundsReleased(recipient, amount);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}