// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

error Raffle__SendMoreToEnterRaffle();

contract Raffle {
  // State variables
  uint256 private immutable i_entranceFee;

  // Lottery Variables
  address payable[] private s_players;

  constructor(uint256 entranceFee) {
    i_entranceFee = entranceFee;
  }

  function enterRaffle() public payable {
    // require(msg.value >= i_entranceFee, "Not enough value sent");

    if (msg.value < i_entranceFee) {
      revert Raffle__SendMoreToEnterRaffle();
    }

    s_players.push(payable(msg.sender));
  }

  // function pickRandomWinner() {}

  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getPlayer(uint256 index) public view returns (address) {
    return s_players[index];
  }
}
