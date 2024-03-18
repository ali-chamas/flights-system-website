<?php

include("../db/connection.php");

$destination=$_GET["destination"];
$date=$_GET["date"];

$query = $mysqli->prepare('
SELECT tickets.id,totalSeats,date,price,status,flightID FROM `tickets` 
 join flights on flights.id=tickets.flightID
WHERE flights.destination=? and tickets.date=?

');
$query->bind_param('ss', $destination, $date);
$query->execute();
$query->store_result();
$num_rows = $query->num_rows();

if ($num_rows == 0) {
    $response['status'] = "no tickets found";
} else {
    $allTickets = [];
    $query->bind_result($id, $totalSeats, $date, $price, $status, $flightID);
    while($query->fetch()) {
        $ticket = [
            'id' => $id,
            'totalSeats' => $totalSeats,
            'date' => $date,
            'price' => $price,
            'status' => $status,
            'flightID' => $flightID
        ];
        $allTickets[] = $ticket;
    }
    $response['status'] = "success";
    $response['allTickets'] = $allTickets;
}

echo json_encode($response);