import React, { useState, useEffect } from "react";
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
import ParticlesBg from "particles-bg";
import CreateWallet from "./components/create-wallet";
import RequestFaucet from "./components/RequestFaucet";
import Balance from "./components/Balance";
import WalletSelector from "./components/WalletSelector";
import SendTransaction from "./components/SendTransactions";

import DetailsPage from "./pages/DetailsPage";
import WalletsPage from "./pages/WalletsPage";
import SearchPage from "./pages/SearchPage";
import WalletShow from "./components/WalletShow";

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
  const [searchedWallet, setSearchedWallet] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleInputChange = (event) => {
    setSearchedWallet(event.target.value);
  };

  const handleSearch = async () => {
    // Call your backend service to search for the wallet address

    if (!searchedWallet) {
      alert("Please enter public address first");
      // window.location.replace("http://localhost:3000/");
    } else {
      // The service should first search in MongoDB and then in BlockCypher if not found
      const response = await fetch(
        `http://localhost:8000/search/${searchedWallet}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);
      localStorage.setItem("results", JSON.stringify(data));
      if (data.message === `No wallet found with address ${searchedWallet}`) {
        alert(
          `No wallet found with address ${searchedWallet} Now querying to blockcypher`
        );
        const response = await fetch(
          `http://localhost:8000/search/blockcypher/${searchedWallet}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log(data);
        localStorage.setItem("results", data);
        setSearchResult(data);
      }
    }
  };

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
              <Link to="/" style={{ textDecoration: "none" }}>
                Home
              </Link>
            </Button>
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              value={searchedWallet}
              onChange={handleInputChange}
            />

            <Button
              as={Link}
              to={`/search/${searchedWallet}`}
              variant="text"
              onClick={handleSearch}
              style={{ textDecoration: "none" }}
              render={() => <SearchPage />}
            >
              Search
            </Button>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {activeWallet ? (
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  className="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeMedium MuiButton-outlinedSizeMedium MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeMedium MuiButton-outlinedSizeMedium css-1rwt2y5-MuiButtonBase-root-MuiButton-root"
                  as={Link}
                  to={`/details/${activeWallet}`}
                  variant="outlined"
                  style={{ marginRight: "10px", textDecoration: "none" }}
                  render={() => <DetailsPage />}
                >
                  Details
                </Button>
              </Box>
            ) : null}

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button variant="outlined">
                <Link to="/wallets" style={{ textDecoration: "none" }}>
                  Wallets
                </Link>
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
      {activeWallet ? (
        <>
          <Balance activeWallet={activeWallet} onNewBalance={setBalance} />

          <WalletShow activeWallet={activeWallet} onNewBalance={setBalance} />
          <br />
        </>
      ) : null}

      <CreateWallet onNewWallet={onNewWallet} />
      <br />

      <div style={{ width: "600px", maxWidth: "90%" }}>
        <Item>
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            {activeWallet ? (
              <>
                {" "}
                {
                  <div>
                    <>
                      You'll need a Faucet to perform transaction. Please
                      request below.
                    </>
                    <RequestFaucet activeWallet={activeWallet} />
                  </div>
                }
              </>
            ) : (
              <>Select a Wallet or Create a New Wallet</>
            )}
          </p>
        </Item>

        <Divider />

        <Item>
          <WalletSelector
            activeWallet={activeWallet}
            onWalletChange={setWalletAddress}
          />

          <SendTransaction activeWallet={activeWallet} />
        </Item>
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
            <Route path="/search/:id" element={<SearchPage />} />
            <Route path="/wallets" element={<WalletsPage />} />
            <Route path="/details/:id" element={<DetailsPage />} />
          </Routes>
        </center>

        <ParticlesBg type="cobweb" color="#ff0000" num={50} bg={true} />
      </div>
    </Router>
  );
}

export default App;
