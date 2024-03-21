<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':

        $response = getRevenue();
        break;

    default:
        $response = ["status" => "Unsupported request method"];
        break;
}

echo json_encode($response);

function getRevenue() {
    global $mysqli;
    $query = $mysqli->prepare("SELECT SUM(tickets.price)
                             FROM bookings 
                             JOIN seats ON bookings.seatID = seats.id
                             JOIN tickets ON seats.ticketID = tickets.id");

            $query->execute();
            $query->store_result();
            $query->bind_result($result);
            $query->fetch();

        return ["status" => "Success", "totalRevenue" => $result];
}