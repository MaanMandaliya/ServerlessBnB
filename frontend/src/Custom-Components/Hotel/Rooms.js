import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import axios from "axios";

function Rooms() {
  const [hotelBookingList, setHotelBookingList] = useState([
    { room_type: "Super Deluxe", room_count: 10, price: 3000, room_id: "1" },
    { room_type: "Deluxe", room_count: 10, price: 2000, room_id: "2" },
    { room_type: "Royal Suite", room_count: 10, price: 6500, room_id: "3" },
  ]);
  const [open, setOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [tmpFood, setTempFood] = useState({});

  let preventApiCall = false;
  let navigate = useNavigate();

  useEffect(() => {
    if (!preventApiCall) {
      preventApiCall = true;
      axios
        .get(
          "https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/showfoodmenu"
        ) // check and test once
        .then((response) => {
          console.log(response);
          setHotelBookingList(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const navigateToFoodOrder = (food) => {
    navigate("/orderFood", { state: food });
  };

  const handleRoomNumberChange = (room) => {
    console.log(room);
    console.log(room.target.value);
    setRoomNumber(room.target.value);
  };

  const handleQuantityChange = (qty) => {
    console.log(qty);
    setQuantity(qty.target.value);
  };

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
    let foodBdy = {
      room_no: roomNumber,
      food_name: tmpFood.food_name,
      quantity: quantity,
    };

    console.log(foodBdy);
    if (roomNumber && quantity) {
      axios
        .post(
          "https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/bookRoom",
          foodBdy
        ) // call aws lmabda function to validate answers
        .then((response) => {
          console.log(response);
          setOpen(false);
        })
        .catch((erroe) => {
          console.log(erroe + " Resitration failed response");
          alert("Registration Failed");
        });
    }
  };

  return (
    <div className="list-body">
      <div className="tableBdy">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Type </TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hotelBookingList.map((hotel) => (
                <TableRow
                  key={hotel.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {hotel.room_type}
                  </TableCell>
                  <TableCell className="table-cell-style" align="right">
                    {hotel.room_count}
                  </TableCell>
                  <TableCell align="right">{hotel.price}</TableCell>
                  <TableCell align="right">
                    <button
                      onClick={() => handleClickOpen(hotel)}
                      style={{ display: "inline-block" }}
                      color="inherit"
                    >
                      Order
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Book room</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Enter length of stay</DialogContentText>

          <div className="f-form-body">
            <div>
              <label>From Date</label>
              <input
                type="number"
                value={roomNumber}
                name="roomNumber"
                onChange={handleRoomNumberChange}
              ></input>
            </div>
            <div>
              <label>To Date</label>
              <input
                type="text"
                value={quantity}
                name="quantity"
                onChange={handleQuantityChange}
              ></input>
            </div>
            <div>
              <label>Quantity</label>
              <input
                type="text"
                value={quantity}
                name="quantity"
                onChange={handleQuantityChange}
              ></input>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <button
            onClick={placeAnOrder}
            style={{ display: "inline-block" }}
            color="inherit"
          >
            Order
          </button>
          {/* <Button onClick={placeAnOrder}>Submit</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Rooms;
