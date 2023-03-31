pragma solidity ^0.8.9;

contract FirstContract {
    uint public myValue; 
    
    constructor(uint initialValue) {
        myValue = initialValue; 
    }
    
    function setVariable(uint newValue) public { 
        myValue = newValue;
    }
}
