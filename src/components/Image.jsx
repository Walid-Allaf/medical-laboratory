import { useTheme } from "@mui/material";

const Image = ({ src, width, height }) => {
  const theme = useTheme();
  return (
    <img
      width={width}
      height={height}
      src={`data:image/jpeg;base64,${src}`}
      alt="img-comp"
      style={{
        borderRadius: "50%",
        borderWidth: "8px",
        borderColor: `${theme.palette.primary.main}`,
        borderStyle: "double",
      }}
    />
  );
};

export default Image;
