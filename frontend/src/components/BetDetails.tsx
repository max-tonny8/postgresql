import { Bet } from "../screens/ProfilePage"; // Adjust the import path to the actual location of your ProfilePage.tsx
import { Modal, Box, Typography, Button, Avatar } from "@mui/material";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface BetDetailsProps {
  bet: Bet;
  open: boolean;
  onClose: () => void;
  onDelete: (betId: number) => void;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };
  return new Date(dateString).toLocaleString("en-US", options);
};

const BetDetails: React.FC<BetDetailsProps> = ({
  bet,
  open,
  onClose,
  onDelete,
}) => {
  // Modal style
  const style = {
    position: "absolute" as const,
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
      aria-labelledby="bet-details-modal-title"
      aria-describedby="bet-details-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            marginBottom: "20px",
          }}
        >
          <Typography id="bet-details-modal-title" variant="h5" component="h2">
            Bet Details
          </Typography>
          <Typography sx={{ mt: 2 }}>Bet Amount: {bet.bet_amount}</Typography>
          <Typography sx={{ mt: 2 }}>
            Potential win: {bet.potential_win}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Bet Decision: {bet.bet_decision}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Match Day: {formatDate(bet.event.event_date)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 3,
            gap: "20px",
            margin: "5px",
          }}
        >
          {/* Team Home Box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid black", // Add border
              p: 2, // Add some padding inside the border
              borderRadius: "8px", // Optional: if you want rounded corners
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Typography>Home:</Typography>
              <Avatar
                alt={bet.event.HomeTeam.team_name}
                src={`${BASE_URL}${bet.event.HomeTeam.teamImage}`}
              />
            </Box>
            <Typography>{bet.event.HomeTeam.team_name}</Typography>
          </Box>
          {/* VS Text Box */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%", // Make sure it's the same height as team boxes
            }}
          >
            <Typography variant="h5">vs</Typography>
          </Box>
          {/* Team Away Box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid black", // Add border
              p: 2, // Add some padding inside the border
              borderRadius: "8px", // Optional: if you want rounded corners
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Typography>Away:</Typography>
              <Avatar
                alt={bet.event.AwayTeam.team_name}
                src={`${BASE_URL}${bet.event.AwayTeam.teamImage}`}
              />
            </Box>
            <Typography>{bet.event.AwayTeam.team_name}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
            gap: "50%",
          }}
        >
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            color="error"
            onClick={() => onDelete(bet.id)}
          >
            Delete
          </Button>
          <Button sx={{ flex: 1 }} variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default BetDetails;
