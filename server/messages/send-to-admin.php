<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

$message = $_POST['message'];
$userID = $_POST['userID'];

$query = $mysqli->prepare('insert into messages(message, userID) values(?,?);');
$query->bind_param('si', $message, $userID);
if ($query->execute()){
    $response['status'] = "success";
    $response['message'] = "message was sent successfully";
} else {
    $response['status'] = "failed";
    $response['message'] = "message wasn't sent";
}

echo json_encode($response);