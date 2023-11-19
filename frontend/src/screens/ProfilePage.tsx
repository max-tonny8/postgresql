import { useSelector } from "react-redux";
import { useGetSingleUserQuery } from "../features/slices/apiSlice"; // Adjust the import path as necessary
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { RootState } from "../features/store";
import { useDeleteBetMutation } from "../features/slices/apiSlice";

import BetDetails from "../components/BetDetails";
import AddBalanceModal from "../components/AddBalanceModal";
import { useEffect, useState } from "react";

export interface Bet {
  id: number;
  bet_decision: "Home" | "Draw" | "Away";
  bet_amount: string;
  potential_win: string;
  status: string;
  user_id: number;
  event_id: number;
  team_id: number | null;
  event: EventDetails;
}

export interface EventDetails {
  id: number;
  event_date: string;
  event_end_date: string;
  status: string;
  homeTeamId: number;
  awayTeamId: number;
  HomeTeam: TeamDetails;
  AwayTeam: TeamDetails;
}

export interface TeamDetails {
  id: number;
  team_name: string;
  teamImage: string;
}

const ProfilePage = () => {
  // Replace 'selectUserId' with the actual selector you have for getting the user ID from the state
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { data: user, error, isLoading } = useGetSingleUserQuery(userInfo.id);
  const [deleteBet] = useDeleteBetMutation();

  //BetDetail Modal attributes
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // State for AddBalanceModal
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false);

  // Local state for user's balance
  const [userBalance, setUserBalance] = useState<number>(0);

  // Define the state for managing the list of bets
  const [bets, setBets] = useState<Bet[]>([]);

  // Update the bets state when the user data is loaded
  useEffect(() => {
    if (user) {
      if (user && user.bets) {
        setBets(user.bets); // Update bets state with user's bets
      }
      if (user.balance !== undefined) {
        setUserBalance(user.balance); // Update balance state
      }
    }
  }, [user]);

  const openAddBalanceModal = () => setIsAddBalanceModalOpen(true);
  const closeAddBalanceModal = () => setIsAddBalanceModalOpen(false);

  const handleDeleteBet = async (betId: number) => {
    try {
      // Find the bet to be deleted to get its amount
      const betToDelete = bets.find((bet) => bet.id === betId);
      const betAmount = betToDelete ? parseFloat(betToDelete.bet_amount) : 0;

      await deleteBet(betId).unwrap();

      // Update the local state to remove the deleted bet
      setBets(bets.filter((bet) => bet.id !== betId));

      // Update the user's balance by adding the bet amount
      setUserBalance((prevBalance) => Number(prevBalance) + Number(betAmount));

      handleCloseModal();
    } catch (error) {
      console.error("Failed to delete bet:", error);
    }
  };

  const handleOpenModal = (bet: Bet) => {
    setSelectedBet(bet);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBet(null);
  };

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography variant="body1">Error: {error.toString()}</Typography>;
  if (!user) return <Typography variant="body1">User not found</Typography>;

  // Function to update the user's balance
  const updateUserBalance = (amount: number) => {
    setUserBalance((prevBalance) => Number(prevBalance) + Number(amount));
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px" }}>
      <Typography variant="h4">Profile Page</Typography>
      <Typography variant="h6">
        {user.firstName} {user.lastName}
      </Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Typography variant="body1">Balance: {userBalance}</Typography>
      <Button variant="outlined" onClick={openAddBalanceModal}>
        Add Balance
      </Button>
      <Typography variant="h6">Bets:</Typography>
      <List>
        {bets.map((bet: Bet) => (
          <ListItem key={bet.id} style={{ padding: 0 }}>
            <Button
              onClick={() => handleOpenModal(bet)}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "flex",
                justifyContent: "center",
                gap: "20%",
                width: "100%",
                padding: "8px",
                margin: "5px",
                textDecoration: "none",
                color: "black",
                "&:hover": {
                  backgroundColor: "purple",
                  color: "white",
                },
              }}
            >
              <Typography variant="body2" noWrap>
                Bet Amount: {bet.bet_amount}
              </Typography>
              <Typography variant="body2" noWrap>
                Potential Win: {bet.potential_win}
              </Typography>
              <Typography variant="body2" noWrap>
                Status: {bet.status}
              </Typography>
            </Button>
          </ListItem>
        ))}
      </List>

      {selectedBet && (
        <BetDetails
          bet={selectedBet}
          open={modalOpen}
          onClose={handleCloseModal}
          onDelete={() => handleDeleteBet(selectedBet.id)}
        />
      )}
      <AddBalanceModal
        open={isAddBalanceModalOpen}
        handleClose={closeAddBalanceModal}
        updateUserBalance={updateUserBalance}
      />
    </Paper>
  );
};

export default ProfilePage;
