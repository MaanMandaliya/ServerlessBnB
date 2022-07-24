import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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


function TourBooking() {
    const [open, setOpen] = useState(false);
    const [tourList,setTourList] = useState([])
    const [Days, setDays]= useState()
    const [RecommededTours,setRecommededTours]=useState([])
    const [Booking, setBooking]=useState({})
    const [username, setusername]=useState('test')

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
        
    }, []);

    const handleClickOpen = (tour) => {
        let tourBdy={
           "tour_name": tour.tour_name,
           "username": username
        };
        console.log(username)

        axios.post('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/booktour', tourBdy)  // call aws lmabda function to validate answers
        .then(response => {
            setBooking(response.data)
            
        })
        .catch(erroe => {
            console.log(erroe + " Booking failed response");
            alert("Booking Failed");
            });
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
    };

  

    function handleRecommendation(e){
        setDays(e.target.value)
        console.log(Days)
        
        var numberOfDays = JSON.stringify({
            "no_of_days": e.target.value
          });
        if(e.target.value>0){
            var config = {
                method: 'post',
                url: 'https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/recommendtours',
                headers: { 
                  'Content-Type': 'application/json'
                },
                data : numberOfDays
              };
                
                axios(config)
                .then(function (response) {
                setRecommededTours(response.data);
                })
                .catch(function (error) {
                console.log(error);
                });
        }       
         }
    return (
        <div className="list-body">
             <div className="f-form-body">
                       <div>
                           <label>Enter Days</label>
                           <input style = {{ flex: 1 }} type="number" value={Days} name="Days" onChange={handleRecommendation} ></input>
                       </div>
                       
                       <br/>
                       {RecommededTours.length > 0 && (
                        
                       <h6>Recommeded Tours</h6>
                       )}
                       <div>
                        
                       <Grid
                            container
                            spacing={4}
                            justifyItems="center"
                            style={{ marginTop: "20px" ,marginLeft: "250px", aligItems: "center" }}
                        >
                    {   RecommededTours.slice(0,3).map((tour)=>{
                        return(<div key={tour[0].tour_id} sx={{MarginLeft:"120px"}}>
                            {console.log(tour[0])}
                            <Item sx={{paddingleft:20}}>
                                <Card sx={{ minWidth: 275}}>
                                <CardContent>
                                    <Typography variant="h5" component="div"></Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {tour[0].tour_name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <button onClick={() => handleClickOpen(tour[0])} style={{  display: 'inline-block' }} color='inherit'>Book</button>
                                  </CardActions>
                                </Card>
                                <tr/>
                            </Item>
                            
                        </div>)
                    })}</Grid>
                </div>
                   </div>     
                   
            <div className="tableBdy">
           
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Tour Name </TableCell>
                                <TableCell>From Date </TableCell>
                                <TableCell>To Date </TableCell>
                                <TableCell align="right">Capacity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {tourList.map((tour) => (
                                <TableRow
                                key={tour.tour_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {tour.tour_name}
                                </TableCell>
                                <TableCell align="center">{tour.from_date}</TableCell>
                                <TableCell className="table-cell-style" align="center">{tour.to_date}</TableCell>
                                <TableCell className="table-cell-style" align="right" >{tour.capacity}</TableCell>
                                <TableCell align="right">{tour.price}</TableCell>
                                <TableCell align="right">
                                    <button onClick={() => handleClickOpen(tour)} style={{  display: 'inline-block' }} color='inherit'>Book</button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                </TableContainer>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Booking Confirmed</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {Booking.message}
                    </DialogContentText>
                    <DialogContentText>
                        {Booking.invoice}
                    </DialogContentText>
                    </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
       
    );
}

export default TourBooking;
