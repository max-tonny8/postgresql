import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  useCreateBetMutation,
  useGetSingleUserQuery,
} from "../features/slices/apiSlice";
import { Event } from "../screens/HomePage"; // Make sure the path is correct
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../features/store";

interface CreateBetModalProps {
  open: boolean;
  onClose: () => void;
  event: Event;
}

const CreateBetModal: React.FC<CreateBetModalProps> = ({
  open,
  onClose,
  event,
}) => {
  const [createBets] = useCreateBetMutation();
  const [betChoice, setBetChoice] = useState("Home");
  const [betAmount, setBetAmount] = useState<number>(5);

  // Get the user info from the Redux store
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // Make sure to check if userInfo is not undefined
  const { refetch } = useGetSingleUserQuery(userInfo?.id, {
    skip: !userInfo, // Skip the query if userInfo is not available
  });

  const handleSubmit = async () => {
    try {
      const event_id = event.id;
      const bet_amount = betAmount;
      const bet_decision = betChoice;

      await createBets({ event_id, bet_amount, bet_decision }).unwrap();
      toast.success("Bet added to profile page", { draggable: false });
      onClose(); // Close the modal
      refetch(); // Manually refetch the user query
    } catch (error) {
      toast.error("Insufficent Balance.Please add balance on profile page.", {
        draggable: false,
      });
    }
  };

  // Modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    maxWidth: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    outline: "none",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-bet-modal-title"
    >
      <Box sx={style}>
        <RadioGroup
          row
          value={betChoice}
          onChange={(e) => setBetChoice(e.target.value)}
        >
          <FormControlLabel
            value="Home"
            control={<Radio />}
            label={event.HomeTeam.team_name}
          />
          <FormControlLabel value="Draw" control={<Radio />} label="Draw" />
          <FormControlLabel
            value="Away"
            control={<Radio />}
            label={event.AwayTeam.team_name}
          />
        </RadioGroup>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="bet-amount-select-label">Bet Amount</InputLabel>
          <Select
            labelId="bet-amount-select-label"
            id="bet-amount-select"
            value={betAmount}
            label="Bet Amount"
            onChange={(e) => setBetAmount(Number(e.target.value))}
          >
            {[5, 10, 25, 50, 75, 100].map((value) => (
              <MenuItem key={value} value={value}>
                ${value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Place Bet
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateBetModal;
