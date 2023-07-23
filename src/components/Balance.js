import React, { useState, useEffect } from "react";

function Balance({ activeWallet, onNewBalance }) {
  const [balance, setBalance] = useState(null);

  // Fetch the balance when the component mounts or when the active wallet changes
  useEffect(() => {
    const fetchBalance = async () => {
      const response = await fetch(
        `http://localhost:8000/balance/${activeWallet}`
      );
      if (response.ok) {
        const data = await response.json();
        setBalance(data);
        onNewBalance(data);
      } else {
        console.error("Failed to fetch balance");
      }
    };

    if (activeWallet) {
      fetchBalance();
    }

    // // Fetch the balance every second
    // const intervalId = setInterval(fetchBalance, 10000);

    // // Clear the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, [activeWallet, onNewBalance]);

  return (
    <div style={{ fontSize: "35px" }}>
      BAL: {balance !== null ? balance : "N/A"}
    </div>
  );
}

export default Balance;
