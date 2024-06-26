import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Tab } from "@mui/material";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const TestSettings = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [value, setValue] = React.useState(pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container sx={{ py: "40px" }}>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                value="/test-settings/categories"
                label="الفئات"
                onClick={() => navigate("/test-settings/categories")}
              />
              <Tab
                value="/test-settings/groups"
                label="المجموعات"
                onClick={() => navigate("/test-settings/groups")}
              />
              <Tab
                value="/test-settings/analysis"
                label="التحاليل"
                onClick={() => navigate("/test-settings/analysis")}
              />
              <Tab
                value="/test-settings/natural-field"
                label="المجال الطبيعي"
                onClick={() => navigate("/test-settings/natural-field")}
              />
            </TabList>
          </Box>
          <TabPanel value={value}>
            <Outlet />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
};

export default TestSettings;
