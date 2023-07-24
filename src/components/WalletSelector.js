import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function WalletSelector({ activeWallet, onWalletChange }) {
  const [wallets, setWallets] = useState([]);
  const theme = useTheme();

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeWallet);
    alert("Copied to clipboard!");
  };

  return (
    <>
      <p style={{ fontSize: "20px" }}>Select a Wallet :</p>
      <hr />
      <br />
      <Select
        style={{ width: "80%" }}
        labelId="wallet-selectorl"
        id="wallet-selector"
        value={activeWallet}
        onChange={(event) => onWalletChange(event.target.value)}
        MenuProps={MenuProps}
      >
        {wallets.map((wallet) => (
          <MenuItem key={wallet.wallet_address} value={wallet.wallet_address}>
            {wallet.wallet_name} - {wallet.wallet_address}
          </MenuItem>
        ))}
      </Select>
      <br />
      <br />
      <Button variant="outlined" onClick={copyToClipboard} color="success">
        Copy Address to Clipboard
      </Button>
      <br />
      <br />
    </>
  );
}

export default WalletSelector;
