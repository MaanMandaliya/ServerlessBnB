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

function OrderFeedback() {
    const [orderLists, setOrderList] = useState([]);
    const [open, setOpen] = useState(false);
    const [room_no, setRoomNo] = useState(0);
    const [food_name, setFoodName] = useState("");
    const [feedback, setFeedback] = useState("");
    const [reviews, setReviews] = useState([]);
    
    let preventApiCall=false;
    let navigate = useNavigate();
   
    useEffect(() => {
        if(!preventApiCall){
            preventApiCall=true;
            axios.get('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/foodorders') // list of food user for that user
            .then(response =>{
                    console.log(response);
                    const filteredFoodOrder=response.data.foodorders.filter((order)=> {return order.customer_id==localStorage.getItem("username")});
                    setOrderList(filteredFoodOrder);
            }).catch(err=>{
                console.log(err);
            })
            axios.get('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/foodfeedbacks') // list of food user for that user
            .then(response =>{
                    console.log(response);
                    setReviews(response.data.food_feedbacks)
                   
            }).catch(err=>{
                console.log(err);
            })
        }
        
    }, []);

    const navigateToFoodOrder=(food)=>{
        navigate('/orderFood', { state: food });
    }

    const handleFeedbackChange=(feedback)=>{
        console.log(feedback);
        setFeedback(feedback.target.value);
    }



    const handleClickOpen = (order) => {
        console.log(order);
        setRoomNo(order.room_no);
        setFoodName(order.food_name);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
    };

    const provideFeedback = (event) => {
        event.preventDefault();
       
        let feedbackBdy={
            "username": localStorage.getItem("username"),
            "feedback": feedback,
            "room_no":room_no,
            "food_name":food_name
        };

        console.log(JSON.stringify(feedbackBdy));
        
        if(feedback){
            axios.post('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/foodfeedback', feedbackBdy)  // call aws lmabda function to validate answers
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
            <h5>My Orders</h5>
            <div className="tableBdy">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell >Order Item</TableCell>
                                <TableCell align="right">Order Quantity</TableCell>
                                <TableCell align="right">Room Number</TableCell>
                                <TableCell align="right">Total Price </TableCell>
                                <TableCell align="right">Action </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {orderLists.map((order) => (
                                <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={order.order_id}
                                >
                               
                                <TableCell component="th" scope="row">{order.food_name}</TableCell>
                                <TableCell align="right">{order.quantity}</TableCell>
                                <TableCell className="table-cell-style" align="right"  >
                                    {order.room_no}
                                </TableCell>
                                <TableCell className="table-cell-style" align="right">
                                    {order.total_price}
                                </TableCell>
                                
                                <TableCell align="right">
                                    <button onClick={() => handleClickOpen(order)} style={{  display: 'inline-block' }} color='inherit'>Feedback</button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                </TableContainer>
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
            <br></br>
            <h5>Orders Feedback</h5>
            <div className="tableBdy">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
 
       
                                <TableCell align="right">Feedback</TableCell>
                                <TableCell align="right">Feedback Score </TableCell>
                                <TableCell align="right">Action </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {reviews.map((review) => (
                                <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={review.feedback_id}
                                >
                               
                              
                                <TableCell className="table-cell-style" align="right"  >
                                    {review.feedback}
                                </TableCell>

                                <TableCell className="table-cell-style" align="right">
                                    {review.feedback_score}
                                </TableCell>
                                
                                <TableCell align="right">
                                    <button onClick={() => handleClickOpen(review)} style={{  display: 'inline-block' }} color='inherit'>Feedback</button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                </TableContainer>
            </div>
        </div>
       
    );
}

export default OrderFeedback;
