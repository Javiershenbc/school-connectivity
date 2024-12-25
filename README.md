# School Connectivity Blockchain Ecosystem

This project is a decentralized system to record and validate school connectivity data on the blockchain. It is designed to handle data for millions of schools, ensuring integrity, scalability, and cost-efficiency while maintaining decentralization.

---

## 🛠️ Technologies Used

- **React**: For building the user interface.
- **ethers.js v6**: To interact with the blockchain.
- **Vite**: For fast and modern development.
- **Metamask**: To handle blockchain transactions securely.

## 📝 Prerequisites

1. **Node.js**: Download it from [nodejs.org](https://nodejs.org/).
2. **Metamask**: Install the browser extension from [Metamask](https://metamask.io/).
3. **Smart Contract**: Deployed on an Ethereum-compatible network. You’ll need its address and ABI.

## 🚀 How to Get Started

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/school-connectivity.git
cd school-connectivity
```

### 2. Install dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Configure the smartcontract

Update the file contractConfig.js with the details of the deployed smartcontract:

- contractAddress: Smartcontract's address
- abiArray: Smartcontract's ABI

In order to get this information you can use Remix or Hardhat to deploy and get the ABI of the smartcontract. The smartcontract from this project has been deployed using Remix.

**There is a more detailed explanation and posible other implementations inside the smartcontracts' README.**

### 4. Start the development server

Run the following command to start the application on http://localhost:5173:

```bash
npm run dev
```

---

## 🚧 Features and Requirements Addressed

### 1. **Decentralized Data Writing Mechanism**

The ecosystem includes a smart contract that enables each instance of the app to independently submit daily connectivity data directly on-chain. The data includes:

- **School ID**
- **Timestamp**
- **Download Speed**
- **Upload Speed**
- **Latency**

This mechanism allows for decentralized operation, where multiple app instances can write data without relying on a centralized server.

---

### 2. **Data Integrity and Validation**

Mechanisms to ensure the validity and consistency of data include:

- **Hash-Based Validation:** A `dataHash` is generated dynamically using the input data (e.g., school ID, speeds, and timestamp). This hash ensures that the data submitted matches its on-chain representation.
- **Spam Prevention:** A modifier prevents duplicate timestamps or unauthorized submissions.

Other mechanism that can be included:

- **Signature Verification:** Each submission is signed off-chain using a private key, ensuring the authenticity of the data.

---

### 3. **Scalability Considerations**

This implementation only saves the latest submit on-chain, but every submit emits a DataSubmitted event. This is a hybrid submit strategy which is designed to reduce the fees and improve the scalability, by minimizing the on-chain data storage while using off-chain mechanisms for monitoring or validation through smart contract events.

The contract is also compatible with Layer 2 blockchains like Polygon and zkRollups to reduce gas fees while maintaining decentralization.

---

### 4. **System Architecture**

The following diagrams illustrates the architecture:

![Data Submission Process](./assets/Data_Submission.png)

- **App Instance:** Each app simulates input (e.g., speed test results) and interacts with the blockchain directly.
- **Blockchain Layer 1:** Stores critical metadata (e.g., hashes) while keeping data decentralized.
- **On Chain Data**: The meta data is stored on the blockchain and it emits an event which allows off-chain mechanism to interact.

![Data Retrieve Process](./assets/Data_retrieve.png)

- **App Instance:** Each app simulates input (e.g., speed test results) and interacts with the blockchain directly.
- **Off Chain Data**: Data Submission events can be read off chain, reducing posible gas fees.

---

### 5. **Decentralized Deployment Strategy**

The system supports multiple independent app instances writing directly to the blockchain:

- **Unique Data Hashes:** Prevent duplicate or conflicting submissions.
- **Role Management:** Ensures only authorized users or app instances can submit data via `AccessControl`.
- **Decentralized App Instances:** No single point of failure; each instance is capable of interacting with the blockchain autonomously.

---
