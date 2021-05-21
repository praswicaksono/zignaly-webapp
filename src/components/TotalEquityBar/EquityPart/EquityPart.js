import React from "react";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import HelpIcon from "@material-ui/icons/Help";

/**
 * @typedef {Object} TooltipObject
 * @property {string} message
 * @property {string} [url]
 *
 * @typedef {Object} DefaultProps
 * @property {string} name
 * @property {JSX.Element} [info]
 * @property {JSX.Element} value
 * @property {TooltipObject} [tooltip]
 */

/**
 * Render a part of the equity bar
 *
 * @param {TooltipObject} props Component props.
 * @returns {JSX.Element} JSX
 */
export const CustomTooltipContent = ({ message, url }) => {
  return (
    <Box alignItems="flex-start" display="flex" flexDirection="column" justifyContent="flex-start">
      <span>
        <FormattedMessage id={message} />
      </span>
      {url && (
        <a className="anchor" href={url} rel="noreferrer" target="_blank">
          <FormattedMessage id="srv.moreinfo" />
        </a>
      )}
    </Box>
  );
};

/**
 * Render a part of the equity bar
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const EquityPart = ({ name, info, value, tooltip }) => {
  return (
    <Box alignItems="flex-start" className="dataBox" display="flex" flexDirection="column">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mb={1}
      >
        <Box alignItems="center" display="flex" flexDirection="row">
          <Typography variant="h4">
            <FormattedMessage id={name} />
          </Typography>
          {tooltip && (
            <Tooltip
              interactive
              placement="top"
              title={<CustomTooltipContent message={tooltip.message} url={tooltip.url} />}
            >
              <HelpIcon className="helpIcon" />
            </Tooltip>
          )}
        </Box>
        {info && <span className="number3 smallText">{info}</span>}
      </Box>
      <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-start">
        <span className="number1">{value}</span>
      </Box>
    </Box>
  );
};

export default EquityPart;
