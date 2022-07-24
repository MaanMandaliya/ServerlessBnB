import { React } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Dashboard() {
    const navigate = useNavigate();

    const handleAction=(type)=>{
        if(type=='food'){
            navigate('../foodMenuList');
        }else if(type=='tour'){

        }else if(type=='room'){

        }else if(type=='orderFeedback'){
            navigate('../orderFeedback');
        }
    }
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "4%" }}>
        Welcome to Bread and Breakfast!
      </h1>
      <Grid
        container
        spacing={4}
        justifyItems="center"
        style={{ marginTop: "80px", aligItems: "center" }}
      >
        <Grid onClick={() => {
                    handleAction('food');
                  }} item xs={4} md={4} xl={4}>
          <Item>
            <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div"></Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Food ordering
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Order Now</Button>
              </CardActions>
            </Card>
          </Item>
        </Grid>
        <Grid item xs={4} md={4} xl={4}>
          <Item>
            <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div"></Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Room Booking
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Book Now</Button>
              </CardActions>
            </Card>
          </Item>
        </Grid>
        <Grid item xs={4} md={4} xl={4}>
          <Item>
            <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div"></Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Tour Booking
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Book Now</Button>
              </CardActions>
            </Card>
          </Item>
        </Grid>
        <Grid onClick={() => {
                    handleAction('orderFeedback');
                  }} item xs={4} md={4} xl={4}>
          <Item>
            <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div"></Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Food order feedback
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Feedback</Button>
              </CardActions>
            </Card>
          </Item>
        </Grid>
       
      </Grid>
    </div>
  );
}

export default Dashboard;
