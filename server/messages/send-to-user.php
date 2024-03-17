<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

$message = $_POST['message'];
$userID = $_POST['userID'];
$receiver = $_POST['receiver'];

$query = $mysqli->prepare('insert into messages(message, userID, receiver) values(?,?,?);');
$query->bind_param('sii', $message, $userID, $receiver);
if ($query->execute()){
    $response['status'] = "success";
    $response['message'] = "message was sent successfully";
} else {
    $response['status'] = "failed";
    $response['message'] = "message wasn't sent";
}

echo json_encode($response);