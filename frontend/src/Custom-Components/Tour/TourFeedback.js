import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));


function TourFeedback() {
    const [open, setOpen] = useState(false);
    const [tourList,setTourList] = useState([])
    const [username, setusername]=useState('test')
    const [feedback, setFeedback] = useState("");
    const [Tour_name, setTour_name] = useState("");
    const [review, setReviews] = useState([]);
    

    let preventApiCall=false;
    let navigate = useNavigate();
   
    useEffect(() => {
        var user=localStorage.getItem("username")
        if(user){
            setusername(user)
        }
        if(!preventApiCall){
            preventApiCall=true;
            axios.get('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/showtours') // check and test once
            .then(response =>{
                    console.log(response);
                    setTourList(response.data);
            }).catch(err=>{
                console.log(err);
            })
        }
        axios
        .get(
          "https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/tourfeedbacks"
        ) // list of tour user for that user
        .then((response) => {
          console.log(response);
          setReviews(response.data.tour_feedbacks);
        })
        .catch((err) => {
          console.log(err);
        });
        
    }, []);

    const handleFeedbackChange=(feedback)=>{
        console.log(feedback);
        setFeedback(feedback.target.value);
    }



    const handleClickOpen = (tour) => {
        console.log(tour);
        setTour_name(tour.tour_name);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
    };

    const provideFeedback = (event) => {
        event.preventDefault();
       
        let feedbackBdy={
            "username": username,
            "feedback": feedback,
            "tour_name":Tour_name
        };

        console.log(JSON.stringify(feedbackBdy));
        
        if(feedback){
            axios.post('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/tourfeedback', feedbackBdy)  // call aws lmabda function to validate answers
                        .then(response => {
                            console.log("Feedback placed");
                            alert("Thank you for providing feedback");
                            navigate("../dashboard");
                            setOpen(false);
                        })
                        .catch(erroe => {
                            console.log(erroe + " Feedback failed");
                            alert("Couldn't save your feedback due to network failure");
                });
        }
    }
    return (
        <div className="list-body">
             <div className="f-form-body">
                       
                       <br/>
                       {tourList.length > 0 && (
                        
                       <h6>Please select tour to provide feedback</h6>
                       )}
                       <div>
                        
                       <Grid
                            container
                            spacing={4}
                            justifyItems="center"
                            style={{ marginTop: "20px" ,marginLeft: "250px", aligItems: "center" }}
                        >
                    {   tourList.map((tour)=>{
                        return(<div key={tour.tour_id} sx={{MarginLeft:"120px"}}>
                            {console.log(tour)}
                            <Item sx={{paddingleft:20}}>
                                <Card sx={{ minWidth: 275}}>
                                <CardContent>
                                    <Typography variant="h5" component="div"></Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {tour.tour_name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <button onClick={() => handleClickOpen(tour)} style={{  display: 'inline-block' }} color='inherit'>Feedback</button>
                                  </CardActions>
                                </Card>
                                <tr/>
                            </Item>
                            
                        </div>)
                    })}</Grid>
                </div>
                   </div>     
                   

                   <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Order Feedback</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide feedback
                    </DialogContentText>
               
                    <div className="f-form-body">
                        <div>
                            <label>Enter Feedback</label>
                            <input type="text" value={feedback} name="feedback" onChange={handleFeedbackChange}></input>
                        </div>
                       
                    </div>           
                    </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <button onClick={provideFeedback} style={{  display: 'inline-block' }} color='inherit'>Submit</button>
                </DialogActions>
            </Dialog>

            <h5>Tour Feedbacks</h5>
      <div className="tableBdy">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Tour Booking Id</TableCell>
                <TableCell align="right">Feedback </TableCell>
                <TableCell align="right">Sentiment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {review.map((tour, id) => (
                <TableRow
                  key={id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {tour.booking_id}
                  </TableCell>
                  <TableCell className="table-cell-style" align="right">
                    {tour.feedback}
                  </TableCell>
                  <TableCell align="right">{tour.feedback_score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

        </div>
       
    );
}

export default TourFeedback;
