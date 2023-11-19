import { useSelector } from "react-redux";
import { useGetEventsQuery } from "../features/slices/apiSlice";
import { useState } from "react";
import { List, ListItem, Paper, Box, Typography, Avatar } from "@mui/material";
import { RootState } from "../features/store";
import { toast } from "react-toastify";

import CreateBetModal from "../components/CreateBetModal";

//I didnt put them another place since only needs its modal(same in the profilepage)
export interface Event {
  id: number;
  event_date: string;
  event_end_date: string;
  status: string;
  homeTeamId: number;
  awayTeamId: number;
  HomeTeam: Team;
  AwayTeam: Team;
  odds: Odd[];
}

interface Team {
  id: number;
  team_name: string;
  teamImage: string;
}

interface Odd {
  home_odd: string;
  draw_odd: string;
  away_odd: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const HomePage = () => {
  const { data: events, error, isLoading } = useGetEventsQuery({});
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleListItemClick = (selectedEvent: Event) => {
    if (userInfo && userInfo.token) {
      setSelectedEvent(selectedEvent);
      setIsModalOpen(true);
    } else {
      toast.error("Login or register to create a bet.", { draggable: false });
    }
  };

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <>
      <Paper sx={{ display: "flex", justifyContent: "center" }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {events &&
            events.map((event: Event) => (
              <ListItem
                key={event.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  height: "100%",
                  gap: 3,
                  "&:hover": {
                    backgroundColor: "purple",
                    color: "white",
                  },
                }}
                onClick={() => handleListItemClick(event)}
              >
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                  }}
                >
                  {/*HOME BOX*/}
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt={event.HomeTeam.team_name}
                      src={`${BASE_URL}${event.HomeTeam.teamImage}`}
                      style={{
                        height: "auto",
                        marginRight: "10px",
                      }}
                    />
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="subtitle1">
                        {event.HomeTeam.team_name}
                      </Typography>
                    </Box>
                  </Box>

                  {/*AWAY BOX*/}
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt={event.AwayTeam.team_name}
                      src={`${BASE_URL}${event.AwayTeam.teamImage}`}
                      style={{
                        height: "auto",
                        marginRight: "10px",
                      }}
                    />
                    <Typography variant="subtitle1">
                      {event.AwayTeam.team_name}
                    </Typography>
                  </Box>
                </Box>
                {/*ODDS BOXES*/}
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "100%",
                    gap: 15,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "purple",
                      border: "3px solid purple",
                      borderRadius: "5px",
                      color: "white",
                      height: "100%",
                      padding: "2px",
                    }}
                  >
                    <Box sx={{ margin: "5px" }}>1</Box>
                    <Box sx={{ margin: "5px" }}>{event.odds[0].home_odd}</Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "purple",
                      border: "3px solid purple",
                      borderRadius: "5px",
                      color: "white",
                      height: "100%",
                      padding: "2px",
                    }}
                  >
                    <Box sx={{ margin: "5px" }}>X</Box>
                    <Box sx={{ margin: "5px" }}>{event.odds[0].draw_odd}</Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "purple",
                      border: "3px solid purple",
                      borderRadius: "5px",
                      color: "white",
                      height: "100%",
                      padding: "2px",
                    }}
                  >
                    <Box sx={{ margin: "5px" }}>2</Box>
                    <Box sx={{ margin: "5px" }}>{event.odds[0].away_odd}</Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
        </List>
      </Paper>
      {selectedEvent && (
        <CreateBetModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </>
  );
};

export default HomePage;
