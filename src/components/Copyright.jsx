import { Box, Link, Typography } from "@mui/material";
import React from "react";

const Copyright = () => {
  return (
    <Box sx={{ mt: 5, display: "flex", alignItems: "center", gap: 0.4 }}>
      <Typography variant="body2" color="#fff" align="center">
        جميع الحقوق محفوظة
      </Typography>
      <Link
        component={"a"}
        href="google.com"
        variant="body2"
        color="#fff"
        align="center"
        sx={{ textDecoration: "underline" }}
      >
        ai-lab
      </Link>
      <Typography variant="body2" color="#fff" align="center">
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};
export default Copyright;
