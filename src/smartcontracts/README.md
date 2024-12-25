## 📜 Smart Contract

The smart contract leverages **Access Control** to ensure that only authorized users can submit data to the blockchain. This ensures security, integrity, and prevents unauthorized writes.

### Key Features of the Smart Contract:

1. **Role-Based Access Control:**

   - The contract uses `AccessControl` from OpenZeppelin to manage permissions.
   - Only users with the `DATA_SUBMITTER_ROLE` can submit data.

2. **Submit Data Functionality:**

   - Allows authorized users to submit data such as:
     - **School ID**: A unique identifier for the school.
     - **Timestamp**: The time the data was recorded.
     - **Download Speed**: Speed in Mbps.
     - **Upload Speed**: Speed in Mbps.
     - **Latency**: Network latency in milliseconds.

3. **Validation Modifiers:**

   - Ensures that the submitted data is within acceptable ranges (e.g., speeds must be positive).

4. **Spam Prevention:**

   - Prevents duplicate entries by disallowing the same timestamp for the same school ID.

5. **Event Emission:**
   - Emits an event `DataSubmitted` after a successful data submission. This event can be used off-chain for monitoring or analysis.

### How It Works:

- **Authorization:**
  - Administrators can grant the `DATA_SUBMITTER_ROLE` to users or app instances that need to write data.
- **Data Submission:**
  - Authorized users can submit data, which is validated and stored on-chain.
- **Event Logging:**
  - All submissions are logged via the `DataSubmitted` event, enabling easy off-chain integration.

## Why Access Control?

1. **Decentralized Authorization**:

   - No single point of failure. Administrators can dynamically assign roles as needed.

2. **Security**:

   - Ensures only trusted entities can write data to the blockchain.

3. **Transparency**:
   - The role assignment and data submission process is auditable on-chain.

## Other posible implementations

1. **Encryption**:
   - One posible implementation would be to encrypt the data from the school with a private key and send a signature in order to prove the authenticity of the data and be able to decrypt the data. In order to do so, there is a need for a entity to distribute those keys.
