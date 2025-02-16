import React, { useState, useContext } from "react";
import classes from "./Payout.module.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { AppContext } from "../store/AppContext";


export default function Payout() {
  const { articles, loading, error } = useContext(AppContext);
  const [payoutRates, setPayoutRates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [authorsPerPage] = useState(10); // Number of authors to display per page

  const handlePayoutRateChange = (author, value) => {
    if (value === "" || value >= 0) {
      setPayoutRates((prevRates) => ({
        ...prevRates,
        [author]: value === "" ? "" : parseFloat(value),
      }));
    }
  };

  const calculatePayout = (author) => {
    const rate = payoutRates[author] || 0;
    const articleCount = articles.filter((article) =>
      article.author
        ?.split(",")
        .map((a) => a.trim())
        .includes(author)
    ).length;
    return rate * articleCount;
  };

  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={classes.error}>Error: {error.message}</div>;
  }

  const authors = [
    ...new Set(
      articles.flatMap((article) =>
        article.author
          ? article.author.split(",").map((a) => a.trim())
          : ["Unknown"]
      )
    ),
  ];

  // Get current authors
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Author",
      "Articles",
      "Payout Rate ($ per article)",
      "Total Payout (in $)",
    ];
    const tableRows = [];

    authors.forEach((author) => {
      const authorData = [
        author,
        articles.filter((article) =>
          article.author
            ?.split(",")
            .map((a) => a.trim())
            .includes(author)
        ).length,
        payoutRates[author] || 0,
        calculatePayout(author),
      ];
      tableRows.push(authorData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Payout Report", 14, 15);
    doc.save("payout_report.pdf");
  };

  const exportToCSV = () => {
    const data = authors.map((author) => ({
      Author: author,
      Articles: articles.filter((article) =>
        article.author
          ?.split(",")
          .map((a) => a.trim())
          .includes(author)
      ).length,
      "Payout Rate ($ per article)": payoutRates[author] || 0,
      "Total Payout ($)": calculatePayout(author),
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "payout_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToGoogleSheets = () => {
    // To be implemented
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerRow}>
        <h1>Payout Calculator</h1>
        <div className={classes.exportButtons}>
          <button onClick={exportToPDF}>Export to PDF</button>
          <button onClick={exportToCSV}>Export to CSV</button>
          <button onClick={exportToGoogleSheets}>
            Export to Google Sheets
          </button>
        </div>
      </div>
      <table className={classes.table} id="payout-table">
        <thead>
          <tr>
            <th>Author</th>
            <th>Articles</th>
            <th>Payout Rate ($ per article)</th>
            <th>Total Payout (in $)</th>
          </tr>
        </thead>
        <tbody>
          {currentAuthors.map((author) => (
            <tr key={author}>
              <td>{author}</td>
              <td>
                {
                  articles.filter((article) =>
                    article.author
                      ?.split(",")
                      .map((a) => a.trim())
                      .includes(author)
                  ).length
                }
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={payoutRates[author] || ""}
                  onChange={(e) =>
                    handlePayoutRateChange(author, e.target.value)
                  }
                  onInput={(e) => {
                    if (e.target.value < 0) e.target.value = 0;
                  }}
                />
              </td>
              <td>{calculatePayout(author)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        authorsPerPage={authorsPerPage}
        totalAuthors={authors.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

const Pagination = ({
  authorsPerPage,
  totalAuthors,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAuthors / authorsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className={classes.pagination}>
        {pageNumbers.map((number) => (
          <li key={number} className={classes.pageItem}>
            <button
              onClick={() => paginate(number)}
              className={`${classes.pageLink} ${
                currentPage === number ? classes.active : ""
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
