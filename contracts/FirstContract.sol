pragma solidity ^0.8.9;

contract FirstContract {
    uint public myVariable; 
    
    constructor(uint initialValue) {
        myVariable = initialValue; 
    }
    
    function setVariable(uint newValue) public { 
        myVariable = newValue;
    }
}
