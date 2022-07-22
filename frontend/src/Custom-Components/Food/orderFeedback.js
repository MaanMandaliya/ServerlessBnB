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
    const [orderLists, setOrderList] = useState([{"food_name":"Pasta","quantity":10,"id":1},{"food_name":"Pizza","quantity":4,"id":2},{"food_name":"Garlic Bread","quantity":8,"id":3}]);
    const [open, setOpen] = useState(false);
    const [orderId, setOrderId] = useState(0);
    const [feedback, setFeedback] = useState("");

    
    let preventApiCall=false;
    let navigate = useNavigate();
   
    useEffect(() => {
        if(!preventApiCall){
            preventApiCall=true;
            axios.get('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/showfoodmenu') // list of food user for that user
            .then(response =>{
                    console.log(response);
                    setOrderList(response.data);
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
        setOrderId(order);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
    };

    const provideFeedback = (event) => {
        event.preventDefault();
       
        let feedbackBdy={
            "order_id": orderId,
            "feedback": feedback
        };

        console.log(feedbackBdy );
        if(feedback){
            axios.post('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/foodfeedback', feedbackBdy)  // call aws lmabda function to validate answers
                        .then(response => {
                            console.log("Feedback placed");
                            alert("Thank you for providing feedback");
                            //navigate("../login");
                            setOpen(false);
                        })
                        .catch(erroe => {
                            console.log(erroe + " Feedback failed");
                            alert("Registration Failed");
                });
        }
    }

    return (
        <div className="list-body">
            <div className="tableBdy">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Order Id </TableCell>
                                <TableCell align="right">Order Item</TableCell>
                                <TableCell align="right">Order Quantity</TableCell>
                                <TableCell align="right">Room Number</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {orderLists.map((order) => (
                                <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {order.id}
                                </TableCell>
                                <TableCell className="table-cell-style" align="right" >{order.food_name}</TableCell>
                                <TableCell align="right">{order.quantity}</TableCell>
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
        </div>
       
    );
}

export default OrderFeedback;
