import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [detailsData, setDetailsData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const { id } = useParams();
  console.log("id: " + id);

  useEffect(() => {
    fetch(`http://localhost:8000/search/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setDetailsData(data.data);
        if (data.status_code === 404)
          fetch(`http://localhost:8000/search/blockcypher/${id}`)
            .then((response) => response.json())
            .then((data) => {
              setDetailsData(data.data);
            });
      });
  }, [id]);

  console.log("details :" + detailsData);
  // You can add a loading state or return null or some placeholder if fetchSearchResults is null
  if (!detailsData) {
    return <p>Please enter a public address</p>;
  }

  return (
    <>
      <h2>Search Result:</h2>
      <div>
        {detailsData.address ? (
          <p>Wallet Address: {detailsData?.address}</p>
        ) : (
          <p>Wallet Address: {detailsData?.walletAddress}</p>
        )}

        {/* Assuming your fetchSearchResults has a balance property. */}
        <p>Balance: {detailsData?.balance}</p>
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
            {detailsData.transactions?.map((transaction) => (
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
