import React, { useState } from "react";
import Button from "@mui/material/Button";
import WalletIcon from "@mui/icons-material/Wallet";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
      window.location.reload(false);
    } else {
      setMessage("Failed to create wallet.");
      console.error("Failed to create wallet");
    }
  };

  return (
    <div>
      <Button onClick={openModal} variant="contained" endIcon={<WalletIcon />}>
        Create New Wallet
      </Button>

      <Modal
        keepMounted
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
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
          <br />
          {message && <p>{message}</p>}
          <center>
            <button onClick={closeModal}>Close</button>
          </center>
        </Box>
      </Modal>
    </div>
  );
}
