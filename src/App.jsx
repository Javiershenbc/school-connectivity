import React, { useState } from "react";
import { BrowserProvider, Contract, keccak256, solidityPacked } from "ethers";
import { contractAddress, abiArray } from "./contractConfig";

const App = () => {
  const [schoolId, setSchoolId] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [latency, setLatency] = useState("");
  const [latestData, setLatestData] = useState(null);
  const [latestDataSchoolId, setlatestDataSchoolId] = useState("");

  const submitData = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask to interact with this app.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abiArray, signer);

      // Dynamically generate dataHash based on the inputs
      const dataHash = keccak256(
        solidityPacked(
          ["uint256", "uint256", "uint32", "uint32", "uint32"],
          [schoolId, timestamp, downloadSpeed, uploadSpeed, latency]
        )
      );

      // Submit data to the contract
      const tx = await contract.submitData(
        schoolId,
        timestamp,
        downloadSpeed,
        uploadSpeed,
        latency,
        dataHash
      );

      alert("Transaction sent. Waiting for confirmation...");
      await tx.wait();
      alert("Transaction confirmed!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting the data.");
    }
  };

  const getLatestData = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask to interact with this app.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, abiArray, provider);
      const data = await contract.getLatestData(latestDataSchoolId);
      setLatestData(data);
    } catch (error) {
      console.error(error);
      alert("Could not fetch data.");
    }
  };

  return (
    <div className="container">
      <h1>School Connectivity Data</h1>
      <div>
        <h3>Submit Data</h3>
        <input
          type="text"
          placeholder="School ID"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Timestamp"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />
        <input
          type="text"
          placeholder="Download Speed"
          value={downloadSpeed}
          onChange={(e) => setDownloadSpeed(e.target.value)}
        />
        <input
          type="text"
          placeholder="Upload Speed"
          value={uploadSpeed}
          onChange={(e) => setUploadSpeed(e.target.value)}
        />
        <input
          type="text"
          placeholder="Latency"
          value={latency}
          onChange={(e) => setLatency(e.target.value)}
        />
        <button onClick={submitData}>Submit</button>
      </div>
      <div>
        <h3>Get Latest Data</h3>
        <input
          type="text"
          placeholder="School ID"
          value={latestDataSchoolId}
          onChange={(e) => setlatestDataSchoolId(e.target.value)}
        />
        <button onClick={getLatestData}>Fetch Data</button>
        {latestData && (
          <div>
            <h4>Latest Data:</h4>
            <p>Timestamp: {latestData.timestamp.toString()}</p>
            <p>Download Speed: {latestData.downloadSpeed.toString()}</p>
            <p>Upload Speed: {latestData.uploadSpeed.toString()}</p>
            <p>Latency: {latestData.latency.toString()}</p>
            <p>Data Hash: {latestData.dataHash}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
