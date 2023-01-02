const { assert, expect } = require('chai');
const { getNamedAccounts, deployments, ethers, network } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle Unit Tests', function () {
      let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer;
      const chainId = network.config.chainId;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);

        raffle = await ethers.getContract('Raffle', deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          'VRFCoordinatorV2Mock',
          deployer
        );
        raffleEntranceFee = await raffle.getEntranceFee();
      });

      describe('constructor', async function () {
        it('initializes the raffle correctly', async function () {
          // Ideally, we'd separate these out so that only 1 assert per "it" block
          // And ideally, we'd make this check everything
          const raffleState = (await raffle.getRaffleState()).toString();
          const interval = await raffle.getInterval();

          assert.equal(raffleState.toString(), '0');
          assert.equal(interval.toString(), networkConfig[chainId]['interval']);
        });
      });

      describe('enterRaffle', async function () {
        it("reverts when you don't pay enough", async function () {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            // Is reverted when not paid enough or raffle is not open
            'Raffle__SendMoreToEnterRaffle'
          );
        });

        it('records player when they enter', async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const playerFromContract = await raffle.getPlayer(0);

          assert.equal(playerFromContract, deployer);
        });

        it('emits event on enter', async function () {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.emit(
            // Emits RaffleEnter event if entered to index player(s) address
            raffle,
            'RaffleEnter'
          );
        });
      });
    });
