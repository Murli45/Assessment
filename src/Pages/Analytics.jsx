import React, { useContext } from "react";
import classes from "./Analytics.module.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { AppContext } from "../store/AppContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const { articles, loading, error } = useContext(AppContext);

  const getAuthorTrends = () => {
    const authorCounts = articles.reduce((acc, article) => {
      const authors = article.author
        ? article.author.split(",").map((author) => author.trim())
        : ["Unknown"];
      authors.forEach((author) => {
        acc[author] = (acc[author] || 0) + 1;
      });
      return acc;
    }, {});

    const labels = Object.keys(authorCounts);
    const data = Object.values(authorCounts);

    const backgroundColors = labels.map(
      (_, index) => `rgba(54, 162, 235, ${0.2 + index * 0.1})`
    );
    const borderColors = labels.map(
      (_, index) => `rgba(54, 162, 235, ${1 - index * 0.1})`
    );

    return {
      labels,
      datasets: [
        {
          label: "Articles by Author",
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          hoverBackgroundColor: borderColors,
          hoverBorderColor: borderColors,
        },
      ],
    };
  };

  const getTypeTrends = () => {
    const typeCounts = articles.reduce((acc, article) => {
      const type = article.source.name || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);

    const colors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
      "rgba(199, 199, 199, 0.6)",
      "rgba(83, 102, 255, 0.6)",
      "rgba(255, 99, 132, 0.8)",
      "rgba(54, 162, 235, 0.8)",
    ];

    const backgroundColors = labels.map(
      (_, index) => colors[index % colors.length]
    );
    const borderColors = labels.map(
      (_, index) => colors[index % colors.length]
    );

    return {
      labels,
      datasets: [
        {
          label: "Articles by Type",
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          hoverBackgroundColor: borderColors,
          hoverBorderColor: borderColors,
        },
      ],
    };
  };

  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={classes.error}>Error: {error.message}</div>;
  }

  return (
    <div className={classes.page}>
      <div className={classes.chartContainer}>
        <div className={classes.card}>
          <h2>Articles by Author</h2>
          <div className={classes.chart}>
            <Bar
              data={getAuthorTrends()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  //   title: { display: true, text: 'Articles by Author' },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Authors",
                      color: "gray",
                      font: {
                        family: "Arial",
                        size: 12,
                        weight: "bold",
                        lineHeight: 1.2,
                      },
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Number of Articles",
                      color: "gray",
                      font: {
                        family: "Arial",
                        size: 12,
                        weight: "bold",
                        lineHeight: 1.2,
                      },
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
        <div className={classes.card}>
          <h2>Articles by Type</h2>
          <div className={classes.chart}>
            <Pie
              data={getTypeTrends()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "right" },
                  //   title: { display: true, text: 'Articles by Type' },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.raw}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
