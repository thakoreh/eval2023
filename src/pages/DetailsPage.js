import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DetailsPage() {
  const [detailsData, setDetailsData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/wallets/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setDetailsData(data);
        fetch(`http://localhost:8000/transactions/walletAddress/${id}`)
          .then((response) => response.json())
          .then((data) => setTransactions(data));
      });
  }, [id]);

  return (
    <div>
      <Card
        sx={{ maxWidth: 345 }}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
      >
        <br />
        <QRCode value={detailsData.walletAddress} />
        <br />
        <br />
        <a
          href={`https://live.blockcypher.com/bcy/address/${detailsData.walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Wallet URL
        </a>
        <h1>Wallet Details</h1>
        <p>
          <h3>Wallet Name:</h3> {detailsData.walletName}
        </p>
        <p>
          <h3>Wallet Address:</h3> {detailsData.walletAddress}
        </p>
        <p>
          <h3>Balance:</h3>
          <p style={{ fontFamily: "fantasy", fontSize: "25px" }}>
            {detailsData.balance}
          </p>
        </p>

        <br></br>
      </Card>
      <h2>Transactions</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Transaction ID</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
              <StyledTableCell align="right">Coin Symbol</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions?.map((transaction) => (
              <StyledTableRow key={transaction.tx_id}>
                <StyledTableCell component="th" scope="row">
                  <a
                    href={`https://live.blockcypher.com/bcy/tx/${transaction.tx_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {transaction.tx_id}
                  </a>
                </StyledTableCell>
                <StyledTableCell align="right">
                  {transaction.amount}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {transaction.coin_symbol.toUpperCase()}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
