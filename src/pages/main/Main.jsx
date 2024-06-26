import { ImageListItem, Typography } from "@mui/material";
import { Box, Container, display } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import { Boxes } from "./Boxes";

const Main = () => {
  const BoxStyles = {
    borderRadius: "10px",
    background: "linear-gradient(50deg, #ffffff90 20%, transparent 50%, #ffffff90 80%)",
    padding: "15px",
    cursor: "pointer",
    textAlign: "center",
    userSelect: "none",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
    "&:has(svg.disable)": {
      display: "none",
    },
  };

  return (
    <Container
      fixed
      sx={{
        py: "50px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography variant="h5">الرئيسية</Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {Boxes.map((item, key) => {
          const { title, path, img } = item;
          return (
            <Link to={path} className="box" key={key}>
              <Box sx={BoxStyles}>
                <ImageListItem
                  sx={{
                    width: "14rem",
                    minHeight: "14rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {img}
                </ImageListItem>
                <Typography color="#fff" sx={{ fontWeight: 700, fontSize: 18 }}>
                  {title}
                </Typography>
              </Box>
            </Link>
          );
        })}
      </Box>
    </Container>
  );
};

export default Main;
