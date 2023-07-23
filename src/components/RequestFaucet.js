import React, { useState } from "react";
import Modal from "react-modal";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

Modal.setAppElement("#root"); // This line is needed for accessibility reasons

function RequestFaucet({ activeWallet }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value < 0) {
      setError("Amount cannot be negative");
    } else if (value === "") {
      setError("Amount cannot be empty");
    } else {
      setError(null);
    }
    setAmount(value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (error || amount === "") {
      alert("Please enter a valid amount");
      return;
    }
    const response = await fetch("http://localhost:8000/requestfaucet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: activeWallet,
        amountRequested: amount,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setMessage("Transaction successful!");
    } else {
      setMessage("Transaction failed.");
      console.error("Failed to request faucet");
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setMessage(null); // Reset the message when closing the modal
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="number"
          value={amount}
          onChange={handleInputChange}
          placeholder="Amount to request"
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button
          style={{
            fontSize: "20px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            transitionDuration: "0.4s",
            margin: "10px auto",
            display: "block",
          }}
          type="submit"
        >
          Request from faucet
        </button>
      </form>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>{message}</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default RequestFaucet;
