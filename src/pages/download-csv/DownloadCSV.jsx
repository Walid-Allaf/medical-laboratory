import { Box, Container, ImageListItem, Typography } from "@mui/material";
import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const DownloadCSV = () => {
  const Boxes = [
    {
      title: "مرض السكري",
      path: `${import.meta.env.VITE_API_BASE_URL}/Diabetes/csv`,
      img: <FileDownloadIcon sx={{ width: "150px", height: "150px" }} color="primary" />,
    },
    {
      title: "مرض قصور الكلية",
      path: `${import.meta.env.VITE_API_BASE_URL}/CKD/csv`,
      img: <FileDownloadIcon sx={{ width: "150px", height: "150px" }} color="primary" />,
    },
    {
      title: "مرض النوبة القلبية",
      path: `${import.meta.env.VITE_API_BASE_URL}/HeartAttack/csv`,
      img: <FileDownloadIcon sx={{ width: "150px", height: "150px" }} color="primary" />,
    },
  ];
  const BoxStyles = {
    borderRadius: "10px",
    background: "linear-gradient(50deg, #ffffff90 20%, transparent 50%, #ffffff90 80%)",
    padding: "15px",
    cursor: "pointer",
    textAlign: "center",
    userSelect: "none",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
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
      <Typography variant="h5">تحميل ملفات CSV</Typography>
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
            <a href={path} className="box" key={key}>
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
            </a>
          );
        })}
      </Box>
    </Container>
  );
};

export default DownloadCSV;
