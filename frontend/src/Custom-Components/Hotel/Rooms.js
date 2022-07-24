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
import { Calendar } from "primereact/calendar";
import * as moment from "moment-timezone";
function Rooms() {
  const [hotelBookingList, setHotelBookingList] = useState([]);
  const [open, setOpen] = useState(false);
  const [roomNumber, setRoomNumber] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [hotelData, setHotelData] = useState({});
  const [value, setValue] = useState(new Date("2014-08-18T21:11:54"));
  const [fromdate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  let preventApiCall = false;
  let navigate = useNavigate();

  useEffect(() => {
    if (!preventApiCall) {
      preventApiCall = true;
      axios
        .get(
          "https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/showrooms"
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

  const handleChange = (newValue) => {
    setValue(newValue);
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

  const handleClickOpen = (hotel) => {
    console.log(hotel);
    setHotelData(hotel);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const placeAnOrder = (event) => {
    event.preventDefault();

    let hotelBody = {
      from_date: moment(fromdate).format().split("T")[0],
      to_date: moment(toDate).format().split("T")[0],
      room_type: hotelData.room_type,
      username: localStorage.getItem("username"),
    };

    console.log(hotelBody);

    axios
      .post(
        "https://7fehecfxif2nvsx4fbdjpps4dm0fncby.lambda-url.us-east-1.on.aws/bookroom",
        hotelBody
      ) // call aws lmabda function to validate answers
      .then((response) => {
        console.log(response);
        setOpen(false);
      })
      .catch((erroe) => {
        console.log(erroe + " Resitration failed response");
        alert("Registration Failed");
      });
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
              {hotelBookingList.map((hotel, id) => (
                <TableRow
                  key={id}
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
                      Book
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Book room</DialogTitle>
        <DialogContent>
          <DialogContentText>Please Enter length of stay</DialogContentText>

          <div className="f-form-body">
            <div>
              <label>From Date</label>
              <Calendar
                id="basic"
                appendTo="self"
                value={fromdate}
                onChange={(e) => setFromDate(e.value)}
              />
            </div>
            <div>
              <label>To Date</label>
              <Calendar
                id="basic"
                appendTo="self"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.value);
                }}
              />
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
