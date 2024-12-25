import React, { useState } from "react";
import { BrowserProvider, Contract, keccak256, solidityPacked } from "ethers";
import { contractAddress, abiArray } from "./contractConfig";

const App = () => {
  const [formData, setFormData] = useState({
    schoolId: "",
    timestamp: "",
    downloadSpeed: "",
    uploadSpeed: "",
    latency: "",
  });

  const [schoolQueryId, setSchoolQueryId] = useState("");
  const [historicalSchoolQueryId, setHistoricalSchoolQueryId] = useState("");
  const [latestData, setLatestData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitData = async () => {
    if (!window.ethereum) {
      alert("Metamask is required to interact with this application. Please install it.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abiArray, signer);

      const { schoolId, timestamp, downloadSpeed, uploadSpeed, latency } = formData;

      // Generate a hash for the submitted data
      const dataHash = keccak256(
        solidityPacked(
          ["uint256", "uint256", "uint32", "uint32", "uint32"],
          [schoolId, timestamp, downloadSpeed, uploadSpeed, latency]
        )
      );

      // Send the data to the contract
      const tx = await contract.submitData(
        schoolId,
        timestamp,
        downloadSpeed,
        uploadSpeed,
        latency,
        dataHash
      );

      alert("Your data has been submitted. Please wait for confirmation...");
      await tx.wait();
      alert("Transaction confirmed! Your data is now on the blockchain.");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Something went wrong while submitting your data. Please try again.");
    }
  };

  const fetchLatestData = async () => {
    if (!window.ethereum) {
      alert("Metamask is required to interact with this application. Please install it.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, abiArray, provider);
      const data = await contract.getLatestData(schoolQueryId);
      setLatestData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to retrieve data. Make sure the school ID is correct.");
    }
  };

  const fetchHistoricalData = async () => {
    if (!window.ethereum) {
      alert("Metamask is required to interact with this application. Please install it.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, abiArray, provider);

      // Filter events for the specific school ID
      const filter = contract.filters.DataSubmitted(historicalSchoolQueryId);

      // Query past events
      const events = await contract.queryFilter(filter);

      // Parse the events
      const data = events.map((event) => ({
        schoolId: event.args.schoolId.toString(),
        timestamp: event.args.timestamp.toString(),
        downloadSpeed: event.args.downloadSpeed.toString(),
        uploadSpeed: event.args.uploadSpeed.toString(),
        latency: event.args.latency.toString(),
        dataHash: event.args.dataHash,
      }));

      setHistoricalData(data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      alert("Failed to retrieve historical data. Make sure the school ID is correct.");
    }
  };


  return (
    <div className="container">
      <h1>Blockchain Data for School Connectivity</h1>
      <section>
        <h3>Submit School Data</h3>
        <input
          type="text"
          name="schoolId"
          placeholder="School ID"
          value={formData.schoolId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="timestamp"
          placeholder="Timestamp (e.g., Unix time)"
          value={formData.timestamp}
          onChange={handleChange}
        />
        <input
          type="text"
          name="downloadSpeed"
          placeholder="Download Speed (Mbps)"
          value={formData.downloadSpeed}
          onChange={handleChange}
        />
        <input
          type="text"
          name="uploadSpeed"
          placeholder="Upload Speed (Mbps)"
          value={formData.uploadSpeed}
          onChange={handleChange}
        />
        <input
          type="text"
          name="latency"
          placeholder="Latency (ms)"
          value={formData.latency}
          onChange={handleChange}
        />
        <button onClick={submitData}>Submit</button>
      </section>

      <section>
        <h3>Retrieve Latest Data</h3>
        <input
          type="text"
          placeholder="School ID"
          value={schoolQueryId}
          onChange={(e) => setSchoolQueryId(e.target.value)}
        />
        <button onClick={fetchLatestData}>Fetch Data</button>
        {latestData && (
          <div>
            <h4>Latest Data for School {schoolQueryId}:</h4>
            <p>Timestamp: {latestData.timestamp.toString()}</p>
            <p>Download Speed: {latestData.downloadSpeed.toString()} Mbps</p>
            <p>Upload Speed: {latestData.uploadSpeed.toString()} Mbps</p>
            <p>Latency: {latestData.latency.toString()} ms</p>
            <p>Data Hash: {latestData.dataHash}</p>
          </div>
        )}
      </section>

      <section>
        <h3>Retrieve Historical Data</h3>
        <input
          type="text"
          placeholder="School ID"
          value={historicalSchoolQueryId}
          onChange={(e) => setHistoricalSchoolQueryId(e.target.value)}
        />
        <button onClick={fetchHistoricalData}>Fetch Historical Data</button>
        {historicalData.length > 0 && (
          <div>
            <h4>Historical Data for School {historicalSchoolQueryId}:</h4>
            {historicalData.map((data, index) => (
              <div key={index}>
                <p>Timestamp: {data.timestamp}</p>
                <p>Download Speed: {data.downloadSpeed} Mbps</p>
                <p>Upload Speed: {data.uploadSpeed} Mbps</p>
                <p>Latency: {data.latency} ms</p>
                <p>Data Hash: {data.dataHash}</p>
                <hr />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
