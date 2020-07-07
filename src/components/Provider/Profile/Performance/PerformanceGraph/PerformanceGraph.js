import React from "react";
import "./PerformanceGraph.scss";
import BarChart from "../../../../Graphs/BarChart";
import { Box, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

/**
 *
 * @typedef {import("../../../../../services/tradeApiClient.types").DefaultProviderGetObject} DefaultProviderGetObject
 * @typedef {import('chart.js').ChartTooltipItem} ChartTooltipItem
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {DefaultProviderGetObject} provider
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const PerformanceGraph = ({ provider }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const prepareValues = () => {
    let stats = provider.performance.weeklyStats;
    let values = [];
    if (stats) {
      if (stats.length > 12) {
        let list = [...stats].sort((a, b) => b.week - a.week);
        values = [...list].splice(0, 12);
        return values.map((item) => item.return);
      }
      let list = [...stats].sort((a, b) => a.week - b.week);
      values = list.map((item) => item.return);
      for (let a = 0; a < 12 - stats.length; a++) {
        values.unshift(0);
      }
      return values;
    }
    return [];
  };

  const values = prepareValues();
  const labels = [...values].map(() => "");
  const options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          stacked: false,
          ticks: {
            display: false,
          },
          gridLines: {
            color: "transparent",
            display: true,
            drawBorder: false,
            zeroLineColor: "#d4d4d4",
          },
        },
      ],
    },
  };

  /**
   * @param {ChartTooltipItem} tooltipItems Tooltip itwm.
   * @returns {string} Tooltip text.
   */
  const tooltipFormat = (tooltipItems /* data */) =>
    `${tooltipItems[isMobile ? "xLabel" : "yLabel"]}`;

  return (
    <Box className="performanceGraph">
      <BarChart
        adjustHeightToContent={isMobile}
        horizontal={isMobile}
        labels={labels}
        options={options}
        tooltipFormat={tooltipFormat}
        values={values}
      />
    </Box>
  );
};

export default PerformanceGraph;