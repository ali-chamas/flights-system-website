<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':

        $response = getTotalBookings();
        break;

    default:
        $response = ["status" => "Unsupported request method"];
        break;
}

echo json_encode($response);

function getTotalBookings() {
    global $mysqli;
    $query = $mysqli->query("SELECT * from bookings ");
    if ($query) {
        $bookings = $query->fetch_all(MYSQLI_ASSOC);
        $totalBookings = count($bookings);
        return ["status" => "Success", "totalBookings" => $totalBookings];
    } else {
        return ["status" => "No users", "totalBookings" => 0];
    }
}

