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
      <h1>Wallet Details</h1>
      <p>Wallet Name: {detailsData.walletName}</p>
      <p>Wallet Address: {detailsData.walletAddress}</p>

      <QRCode value={detailsData.walletAddress} />
      <br></br>
      <a
        href={`https://live.blockcypher.com/bcy/address/${detailsData.walletAddress}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Wallet URL
      </a>
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
                  {transaction.coin_symbol}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
