# Critical Asset Inflation Vulnerability in L1StandardBridge.sol

**Title:** Asset inflation vulnerability in L1StandardBridge.sol via `depositERC20To` function leads to bridge peg breaking and potential fund theft.

---

## Vulnerability Summary

This repository contains a working Proof of Concept (PoC) demonstrating a critical asset inflation vulnerability in the `L1StandardBridge.sol` contract. The `depositERC20To` function does not validate the actual amount of tokens transferred, blindly trusting the `_amount` parameter.

By using a malicious ERC20 token with a fee-on-transfer mechanism, an attacker can make the bridge record a deposit of X tokens while only receiving X - Y tokens (where Y is the fee). This breaks the 1:1 asset peg of the bridge, creating a deficit on L1 that can be exploited to steal funds.

This PoC demonstrates the creation of a **$10,000,000 deficit** in a single transaction, proving the vulnerability is not a minor accounting error but a critical, scalable threat to the bridge's solvency.

## How to Reproduce

### 1. Prerequisites
- Node.js (v18 or later)
- npm
- Git

### 2. Setup
Clone the repository and install the required dependencies.

\`\`\`bash
git clone https://github.com/MaeenAhmed/Base-bridge-poc.git
cd Base-bridge-poc
npm install
\`\`\`

### 3. Configuration
Create a `.env` file in the root of the project and add your Alchemy Sepolia RPC URL. The file should contain one line:

\`\`\`
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY"
\`\`\`

### 4. Execute the Proof of Concept
Run the Hardhat test command. This will fork the Sepolia network and execute the attack against the live bridge contract in a simulated environment.

\`\`\`bash
npx hardhat test
\`\`\`

### 5. Expected Outcome
The test will pass, and the console output will confirm the creation of a massive deficit, proving the vulnerability. You will see the following output:

\`\`\`
--- CATASTROPHIC VULNERABILITY CONFIRMED ---
Declared Deposit Amount: 100000000.0
Actual Amount Received by Bridge: 90000000.0

>> Deficit Created: 10000000.0 tokens
   (Assuming a stablecoin, this represents a $10,000,000 loss in a single transaction )

>> PoC Successful. The vulnerability is scalable and critical.
\`\`\`

---

**Discovered and developed by:** Eng. MAEEN AHMED QASEM AL-GUMAEI
