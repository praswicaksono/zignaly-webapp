import React from 'react';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withLayout from "../../layouts/appLayout";
import withPageContext from "../../pageContext";
import Helmet from 'react-helmet';

const SignalProviders = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Signal Providers</title>
            </Helmet>
            <Box display="flex" flexDirection="row" justifyContent="center" className="dashboard">
                <h1>I will be the Signal Providers</h1>
            </Box>
        </React.Fragment>
    )
}

export default compose(
    withPageContext,
    withLayout
)(SignalProviders);