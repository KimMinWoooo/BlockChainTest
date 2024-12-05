import React, { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = ""; // 배포된 스마트 계약 주소 입력하기!
const ABI = [
  "function registerMember(string id, string data) public",
  "function verifyMember(string id, string data) public view returns (bool)",
  "function deleteMember(string id) public",
  "function isMember(string id) public view returns (bool)"
];

function App() {
  const [id, setId] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("MetaMask is not installed!");
      throw new Error("MetaMask is not installed!");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const handleRegister = async () => {
    try {
      await connectWallet();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.registerMember(id, data);
      await tx.wait();
      setStatus("Member registered successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error registering member.");
    }
  };

  const handleVerify = async () => {
    try {
      await connectWallet();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const isValid = await contract.verifyMember(id, data);
      setStatus(isValid ? "Member verified!" : "Invalid member data!");
    } catch (error) {
      console.error(error);
      setStatus("Error verifying member.");
    }
  };

  const handleDelete = async () => {
    try {
      await connectWallet();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.deleteMember(id);
      await tx.wait();
      setStatus("Member deleted successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error deleting member.");
    }
  };

  return (
    <div>
      <h1>Membership Authentication</h1>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter Member ID"
      />
      <input
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Enter Member Data"
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleVerify}>Verify</button>
      <button onClick={handleDelete}>Delete</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
