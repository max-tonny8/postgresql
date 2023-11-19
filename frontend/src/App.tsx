import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import { Box } from "@mui/system";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <Header />
        <ToastContainer />

        <Outlet />
      </Box>
    </>
  );
}
