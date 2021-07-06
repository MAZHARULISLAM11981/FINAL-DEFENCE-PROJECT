import { Box, Container } from "@material-ui/core";
import React from "react";
function TabPanelComponent(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Container maxWidth="lg">
          <Box p={3}> {children} </Box>
        </Container>
      )}
    </div>
  );
}

export default TabPanelComponent;
