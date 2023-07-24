import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const SearchPage = () => {
  const [fetchWalletAddress, setFetchWalletAddress] = useState("");
  const [fetchDataResults, setFetchDataResults] = useState({});

  // Fetch results from local storage
  useEffect(() => {
    const searchResults = window.localStorage.getItem("results");
    if (searchResults) {
      try {
        const x = JSON.parse(searchResults);
        setFetchWalletAddress(x.data.walletAddress);
        setFetchDataResults(x.data);
      } catch {
        setFetchWalletAddress(null);
      }
    }
  }, []);

  // You can add a loading state or return null or some placeholder if fetchSearchResults is null
  if (!fetchWalletAddress) {
    return <p>Please enter a public address</p>;
  }

  return (
    <>
      <h2>Search Result:</h2>
      <div>
        <p>Wallet Address: {fetchWalletAddress}</p>
        {/* Assuming your fetchSearchResults has a balance property. */}
        <p>Balance: {fetchDataResults.balance}</p>
      </div>
      <h2>Transactions:</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction Reference</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Coin Symbol</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchDataResults?.transactions.map((transaction) => (
              <TableRow key={transaction.tx_ref}>
                <TableCell component="th" scope="row">
                  <a
                    href={`https://live.blockcypher.com/bcy/tx/${transaction.tx_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {transaction.tx_id}
                  </a>
                </TableCell>
                <TableCell align="right">{transaction.amount}</TableCell>
                <TableCell align="right">BCY</TableCell>
                <TableCell align="right">{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SearchPage;
