import React, { useState, useEffect } from "react";

function WalletShow({ activeWallet }) {
  const [detailsData, setDetailsData] = useState({});
  const [transactions, setTransactions] = useState([]);

  const { walletName } = detailsData;
  useEffect(() => {
    fetch(`http://localhost:8000/wallets/${activeWallet}`)
      .then((response) => response.json())
      .then((data) => {
        setDetailsData(data);
        fetch(
          `http://localhost:8000/transactions/walletAddress/${activeWallet}`
        )
          .then((response) => response.json())
          .then((data) => setTransactions(data));
      });
  }, [activeWallet]);

  return (
    <div style={{ fontSize: "35px" }}>
      <div>
        Wallet Address:
        {activeWallet !== null ? (
          activeWallet
        ) : (
          <>
            <p style={{ fontSize: "20px" }}>N/A.</p>
            <p style={{ fontSize: "15px" }}>Please select wallet below</p>
          </>
        )}
      </div>
      <div>
        Wallet Name:
        {walletName !== null ? (
          walletName
        ) : (
          <>
            <p style={{ fontSize: "20px" }}>N/A.</p>
            <p style={{ fontSize: "15px" }}>Please select wallet below</p>
          </>
        )}
      </div>
    </div>
  );
}

export default WalletShow;
