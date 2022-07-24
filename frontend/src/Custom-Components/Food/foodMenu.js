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

function FoodMenuList() {
    const [foodMenuList, setFoodMenuList] = useState([]);
    const [open, setOpen] = useState(false);
    const [roomNumber, setRoomNumber] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [tmpFood, setTempFood] = useState({});
    
    
    let preventApiCall=false;
    let navigate = useNavigate();
   
    useEffect(() => {
        if(!preventApiCall){
            preventApiCall=true;
            axios.get('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/showfoodmenu') // check and test once
            .then(response =>{
                    console.log(response);
                    setFoodMenuList(response.data);
            }).catch(err=>{
                console.log(err);
            })
        }
        
    }, []);

    const navigateToFoodOrder=(food)=>{
        navigate('/orderFood', { state: food });
    }

    const handleRoomNumberChange=(room)=>{
        console.log(room);
        console.log(room.target.value);
        setRoomNumber(room.target.value);
    }

    const handleQuantityChange=(qty)=>{
        console.log(qty);
        setQuantity(qty.target.value);
    }


    const handleClickOpen = (food) => {
        console.log(food);
        setTempFood(food);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
    };

    const placeAnOrder = (event) => {
        event.preventDefault();
        console.log(tmpFood);
        let foodBdy={
            "room_no": roomNumber,
            "food_name": tmpFood.food_name,
            "quantity": quantity,
            "username":localStorage.getItem("username")
        };

        console.log(foodBdy);
        if(roomNumber && quantity){
            axios.post('https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/orderfood', foodBdy)  // call aws lmabda function to validate answers
                        .then(response => {
                            console.log("Food ordered");
                            alert("Thank you for placing the Food order");
                            navigate("../dashboard");
                            setOpen(false);
                        })
                        .catch(erroe => {
                            console.log(erroe + " Resitration failed response");
                            alert("Couldn'd place and order");
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
                                <TableCell>Food Name </TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {foodMenuList.map((food) => (
                                <TableRow
                                key={food.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {food.food_name}
                                </TableCell>
                                <TableCell className="table-cell-style" align="right" >{food.quantity}</TableCell>
                                <TableCell align="right">{food.price}</TableCell>
                                <TableCell align="right">
                                    <button onClick={() => handleClickOpen(food)} style={{  display: 'inline-block' }} color='inherit'>Order</button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                </TableContainer>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Order Food</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please Enter Room Number and quantity
                    </DialogContentText>
               
                    <div className="f-form-body">
                        <div>
                            <label>Room Number</label>
                            <input type="number" value={roomNumber} name="roomNumber" onChange={handleRoomNumberChange}></input>
                        </div>
                        <div>
                            <label>Quantitye</label>
                            <input type="text" value={quantity} name="quantity" onChange={handleQuantityChange}></input>
                        </div>
                    </div>           
                    </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <button onClick={placeAnOrder} style={{  display: 'inline-block' }} color='inherit'>Order</button>
                {/* <Button onClick={placeAnOrder}>Submit</Button> */}
                </DialogActions>
            </Dialog>
        </div>
       
    );
}

export default FoodMenuList;
