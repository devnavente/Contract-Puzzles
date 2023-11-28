const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    const threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';

    let valid = false;
    let wallet = null;
    let address = null;

    while (!valid) {
      wallet = ethers.Wallet.createRandom();
      address = await wallet.getAddress();

      if (address < threshold) {
        valid = true;
      }

    }

    wallet = wallet.connect(ethers.provider);
    const signer = await ethers.provider.getSigner(0);

    // sends some ether(needed for gas fees on the upcoming function call)
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther('200')
    })

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
