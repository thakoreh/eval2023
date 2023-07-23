// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// function WalletsPage() {
//   const [wallets, setWallets] = useState([]);

//   useEffect(() => {
//     // Fetch wallet data from your backend.
//     fetch("http://localhost:8000/wallets")
//       .then((response) => response.json())
//       .then((data) => setWallets(data))
//       .catch((error) => console.error(error));
//   }, []);

//   return (
//     <div>
//       <h1>Wallets</h1>
//       <ul>
//         {wallets.map((wallet) => (
//           <li key={wallet.index}>
//             <Link to={`/details/${wallet.wallet_address}`}>
//               {wallet.wallet_name} - {wallet.wallet_address}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default WalletsPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function WalletsPage() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/wallets")
      .then((response) => response.json())
      .then((data) => setWallets(data));
  }, []);

  return (
    <div>
      <h1>All Wallets</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Wallet Name</StyledTableCell>
              <StyledTableCell align="right">Wallet Address</StyledTableCell>
              <StyledTableCell align="right">Details</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets.map((wallet) => (
              <StyledTableRow key={wallet.index}>
                <StyledTableCell component="th" scope="row">
                  {wallet.wallet_name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {wallet.wallet_address}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Link to={`/details/${wallet.wallet_address}`}>
                    View Details
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
