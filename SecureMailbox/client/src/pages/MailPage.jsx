import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tab, Tabs } from "@material-ui/core";
import MailListComponent from "../components/MailListComponent";
import TabPanelComponent from "../components/TabPanelComponent";
import CreateMailComponent from "../components/CreateMailComponent";

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

function MailPage() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Paper elevation={0} className={classes.margin}>
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" centered aria-label="simple tabs example">
          <Tab label="Mail List" {...a11yProps(0)} />
          <Tab label="Send Mail" {...a11yProps(1)} />
        </Tabs>
      </Paper>

      <TabPanelComponent value={value} index={0}>
        <MailListComponent />
      </TabPanelComponent>
      <TabPanelComponent value={value} index={1}>
        <CreateMailComponent />
      </TabPanelComponent>
    </div>
  );
}

export default MailPage;
