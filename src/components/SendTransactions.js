import React, { useState } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function SendTransaction({ activeWallet }) {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAmountChange = (event) => {
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

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (error || amount === "" || destination === "") {
      alert("Please enter valid transaction details");
      return;
    }
    setIsLoading(true); // Start the loading state
    const response = await fetch("http://localhost:8000/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: activeWallet,
        destination: destination,
        amount: amount,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const transactionId = data.response; // Assuming the transaction ID is in the _id field
      const status_code = data.status_code; // Status code
      if (status_code === 500) {
        alert("Please check your address again!");
        setIsLoading(false);
        return;
      }
      if (status_code === 400) {
        alert("Please increase sending amount, It is too low");
        setIsLoading(false);
        return;
      }
      let confirmations = 0;
      // Poll the backend every second until confirmations >= 1
      while (confirmations < 1) {
        const transactionResponse = await fetch(
          `https://api.blockcypher.com/v1/bcy/test/txs/${transactionId}?limit=50&includeHex=true`
        );
        if (transactionResponse.ok) {
          const transactionData = await transactionResponse.json();
          confirmations = transactionData.confirmations;
        } else {
          console.error("Failed to fetch transaction");
          alert("Transaction failed.");
          setIsLoading(false); // End the loading state
          return;
        }
        // Wait for 1 second before the next request
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Update the balance in MongoDB
      await fetch("http://localhost:8000/updatebalance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: activeWallet,
          amount: amount,
          destination: activeWallet,
        }),
      });

      alert("Transaction successful!");
    } else {
      console.error("Failed to send transaction");
      alert("Transaction failed.");
    }
    setIsLoading(false); // End the loading state
  };

  return (
    <form onSubmit={handleFormSubmit}>
      Amount to be sent :<hr />
      <TextField
        id="amt_to_send"
        label="Amount to send"
        variant="outlined"
        style={{ width: "80%" }}
        type="number"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Amount to send"
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <br />
      <br />
      <br />
      <br />
      <br />
      Destination address :<hr />
      <TextField
        id="destination-address"
        label="Destination address"
        variant="outlined"
        style={{ width: "80%" }}
        type="text"
        value={destination}
        onChange={handleDestinationChange}
        placeholder="Destination address"
      />
      <br />
      <br />
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
      {isLoading ? (
        <>
          <Box sx={{ display: "block", marginTop: "20px" }}>
            <CircularProgress />
          </Box>
        </>
      ) : null}
    </form>
  );
}

export default SendTransaction;
