import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tab, Tabs } from "@material-ui/core";
import TabPanelComponent from "../components/TabPanelComponent";
import EncryptionComponent from "../components/EncryptionComponent";
import DecryptionComponent from "../components/DecryptionComponent";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  margin: {
    margin: "15px 25px",
  },
}));

TabPanelComponent.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function ConversionPage() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.margin}>
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" centered aria-label="simple tabs example">
          <Tab label="Encryption" {...a11yProps(0)} />
          <Tab label="Decryption" {...a11yProps(1)} />
        </Tabs>
      </Paper>

      <TabPanelComponent value={value} index={0}>
        <EncryptionComponent />
      </TabPanelComponent>
      <TabPanelComponent value={value} index={1}>
        <DecryptionComponent />
      </TabPanelComponent>
    </div>
  );
}

export default ConversionPage;
