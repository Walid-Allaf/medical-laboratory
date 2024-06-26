import { Box, CircularProgress, Container, Typography } from "@mui/material";
import React from "react";
import ai from "../../assets/joinblink-blink.gif";
import { axiosAi } from "../../axios/axiosClient";
import HeartAttack from "./HeartAttack";
import { useSearchParams } from "react-router-dom";
import Diabetes from "./Diabetes";
import KidneyFailure from "./KidneyFailure";

const AiResult = () => {
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState(null);
  const getResult = () => {};
  const [searchParams, setSearchParams] = useSearchParams();
  React.useEffect(() => {
    getResult();
    console.log(searchParams.get("disease"));
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        background: "#fcfefc",
      }}
    >
      <Box>
        {searchParams.get("disease") == "heart-attack" ? (
          <HeartAttack />
        ) : searchParams.get("disease") == "diabetes" ? (
          <Diabetes />
        ) : (
          <KidneyFailure />
        )}
      </Box>
      <Box>
        <img width="500px" src={ai} alt="ai" />
      </Box>
    </Box>
  );
};

export default AiResult;
