import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // This line is needed for accessibility reasons

export default function CreateWallet({ onNewWallet }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [walletName, setWalletName] = useState("");
  const [message, setMessage] = useState(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setMessage(null); // Reset the message when closing the modal
  };

  const handleInputChange = (event) => {
    setWalletName(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8000/wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletName: walletName,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setMessage("Wallet created successfully!");
      onNewWallet(data.walletAddress); // Pass the new wallet address to the parent component
    } else {
      setMessage("Failed to create wallet.");
      console.error("Failed to create wallet");
    }
  };

  return (
    <div>
      <button onClick={openModal}>Create New Wallet</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Create a new wallet</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleFormSubmit}>
          <label>
            Wallet name:
            <input
              type="text"
              value={walletName}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Create Wallet</button>
        </form>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}
