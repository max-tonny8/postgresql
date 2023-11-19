// AddBalanceModal.js
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useAddBalanceMutation } from "../features/slices/apiSlice";

interface AddBalanceModalProps {
  open: boolean;
  handleClose: () => void;
  updateUserBalance: (amount: number) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  open,
  handleClose,
  updateUserBalance,
}) => {
  const [amount, setAmount] = useState<number>(5);
  const [addBalance] = useAddBalanceMutation();

  const handleAddBalance = async () => {
    try {
      await addBalance({ amount }).unwrap();
      updateUserBalance(amount); // Update the user's balance
      handleClose();
    } catch (error) {
      console.error("Failed to add balance:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Balance
        </Typography>
        <FormControl fullWidth>
          <Select
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} // Convert to number
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              Select Amount
            </MenuItem>
            {[5, 10, 25, 50, 75, 100].map((value) => (
              <MenuItem key={value} value={value}>
                ${value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddBalance} variant="contained">
            Pay
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddBalanceModal;
