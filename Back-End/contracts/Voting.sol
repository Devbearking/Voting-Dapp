// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;
/**
   * @title Voting
   * @dev ContractDescription
   * @custom:dev-run-script ../scripts/Voting.ts
*/


contract Voting {

    struct Option {
        string name;
        uint voteCount;
    }

    Option[] public options;
    mapping(address => bool) public voters;

    
    // Only the owner can add and remove people to vote for
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }


    // Allow the owner to add a new person to vote for
    function addPerson(string memory personName) public  {
        options.push(Option(personName, 0));
        
        
    }

    // Allow the owner to remove a person from voting options
    function removePerson(uint optionIndex) public {
        require(optionIndex < options.length, "Invalid option index");
        
        // Move the last option to the position of the removed option
        options[optionIndex] = options[options.length - 1];
        options.pop();
    }

    string candidate = '';
    uint voteCounter = 0;

    // Allow users to vote for a person
    function voteForOption(uint optionIndex) public returns (string memory votedFor){
        
        require(optionIndex < options.length, "Invalid option index");
        require(!voters[msg.sender], "You have already voted");

        options[optionIndex].voteCount += 1;
        voters[msg.sender] = true;
        voteCounter = options[optionIndex].voteCount;
        candidate = options[optionIndex].name;
        return (candidate);
    }

    // Get vote results for every candidate 
    function GetVoteResults() public view returns (string[] memory, uint[] memory) {
            string[] memory names = new string[](options.length);
            uint[] memory votes = new uint[](options.length);
        for (uint i = 0; i < options.length; i++){
            names[i] = options[i].name;
            votes[i] = options[i].voteCount;
        }
        return (names, votes);
    }

     function hashNumbers(uint[] memory numbers) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(numbers));
    }
}
