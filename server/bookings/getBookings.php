<?php
include("../db/connection.php");

$id=$_GET['id'];

$query=$mysqli->prepare('
SELECT tickets.price,tickets.date,tickets.status,flights.departure,flights.destination,seats.seatNumber,users.email
FROM Bookings
JOIN seats  on seats.id = bookings.seatID
JOIN tickets on tickets.id = seats.ticketID
JOIN flights on flights.id = tickets.flightID
JOIN users on users.id = bookings.userID
WHERE bookings.userID = ?
');
$query->bind_param('i',$id);
$query->execute();
$query->store_result();
$num_rows=$query->num_rows;

if($num_rows> 0){
$bookings = [];
$query->bind_result($price,$date,$status,$departure,$destination,$seatNumber,$email);

while($query->fetch()){
    
    $booking=[
        'price'=>$price,
        'date'=>$date,
        'status'=>$status,
        'departure'=>$departure,
        'destination'=>$destination,
        'seatNumber'=>$seatNumber,
        'email'=>$email
    ];
    $bookings[]= $booking;
}
    $response['status']="success";
    $response["bookings"]=$bookings;
}
else{
    $response['status']="failed";
}

echo json_encode( $response );

