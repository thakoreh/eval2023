import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import ParticleBackground from "./particleBackground";
import CreateWallet from "./components/create-wallet";
import RequestFaucet from "./components/RequestFaucet";
import Balance from "./components/Balance";
import WalletSelector from "./components/WalletSelector";
import SendTransaction from "./components/SendTransactions";

import DetailsPage from "./pages/DetailsPage";
import WalletsPage from "./pages/WalletsPage";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Header({ activeWallet }) {
  return (
    <header>
      <Grid container spacing={3}>
        <Grid xs>
          <Item style={{ height: "50px", fontSize: "35px" }}>
            <Link to="/">Home</Link>
          </Item>
        </Grid>
        <Grid xs={6}>
          <Item>
            <input
              type="text"
              placeholder="Enter an address, transaction hash, block hash, block number, or wallet name."
              style={{
                marginRight: "10px",
                height: "50px",
                width: "80%",
                flexGrow: 0.5,
                borderRadius: "10px",
              }}
            />
            <Button variant="contained">Search</Button>
          </Item>
        </Grid>
        <Grid xs>
          <Item style={{ display: "grid", height: "50px" }}>
            <div>
              <div className="details">
                <Link to="/details">Details</Link>
              </div>
              <div className="wallets">
                <Link to="/wallets">Wallets</Link>
              </div>

              <div className="accountName">
                <p>{activeWallet || "No Account Yet"}</p>
              </div>
            </div>
          </Item>
        </Grid>
      </Grid>
    </header>
  );
}

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),

    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

function SearchAppBar({ activeWallet }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{ borderRadius: "20px", backgroundColor: "transparent" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Button variant="outlined">
              <Link to="/">Home</Link>
            </Button>
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Txs"
              inputProps={{ "aria-label": "search" }}
            />
            <Button variant="text">Search</Button>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button variant="outlined" style={{ marginRight: "10px" }}>
                <Link to="/details">Details</Link>
              </Button>
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button variant="outlined">
                <Link to="/wallets">Wallets</Link>
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function HomePage({
  activeWallet,
  onNewWallet,
  balance,
  setBalance,
  setWalletAddress,
}) {
  return (
    <>
      <Balance activeWallet={activeWallet} onNewBalance={setBalance} />

      <CreateWallet onNewWallet={onNewWallet} />

      <div style={{ width: "600px", maxWidth: "90%" }}>
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          {balance
            ? "Perform transaction"
            : "You have 0 in your wallet. Please request for faucet"}
        </p>
        <RequestFaucet activeWallet={activeWallet} />
        <Divider />
        <WalletSelector
          activeWallet={activeWallet}
          onWalletChange={setWalletAddress}
        />

        <SendTransaction activeWallet={activeWallet} />
      </div>
    </>
  );
}

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const handleNewWallet = (address) => {
    setWalletAddress(address);
  };
  console.log("walletAddress :" + walletAddress);

  return (
    <Router>
      <div
        className="App"
        style={{
          justifyItems: "center",
          height: "100vh",
        }}
      >
        <SearchAppBar activeWallet={walletAddress} />
        {/* <Header activeWallet={walletAddress} /> */}
        <br />
        <center>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  activeWallet={walletAddress}
                  onNewWallet={handleNewWallet}
                  balance={balance}
                  setBalance={setBalance}
                  setWalletAddress={setWalletAddress}
                />
              }
            />
            <Route path="/wallets" element={<WalletsPage />} />
            <Route path="/details/:id" element={<DetailsPage />} />
          </Routes>
        </center>
        <ParticleBackground />
      </div>
    </Router>
  );
}

export default App;
