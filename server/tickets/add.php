<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

$totalSeats = $_POST['totalSeats'];
$date = $_POST['date'];
$price = $_POST['price'];

$query = $mysqli->prepare('insert into tickets(totalSeats, date, price) values(?,?,?);');
$query->bind_param('isd', $totalSeats, $date, $price);
if ($query->execute()){
    $response['status'] = "success";
    $response['message'] = "ticket was added successfully";
} else {
    $response['status'] = "failed";
    $response['message'] = "ticket wasn't added";
}

echo json_encode($response);