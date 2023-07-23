import React, { useState, useEffect } from "react";

function WalletSelector({ activeWallet, onWalletChange }) {
  const [wallets, setWallets] = useState([]);

  // Fetch the list of wallets when the component mounts
  useEffect(() => {
    const fetchWallets = async () => {
      const response = await fetch("http://localhost:8000/wallets");
      if (response.ok) {
        const data = await response.json();
        setWallets(data);
      } else {
        console.error("Failed to fetch wallets");
      }
    };

    fetchWallets();
  }, []);

  return (
    <>
      Select a Wallet :<hr />
      <select
        style={{ width: "60%" }}
        value={activeWallet}
        onChange={(event) => onWalletChange(event.target.value)}
      >
        {wallets.map((wallet) => (
          <option key={wallet.wallet_address} value={wallet.wallet_address}>
            {wallet.wallet_name} - {wallet.wallet_address}
          </option>
        ))}
      </select>
    </>
  );
}

export default WalletSelector;
