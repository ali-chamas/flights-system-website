<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];


$query = $mysqli->prepare('select message from messages');
$query->execute();
$query->store_result();
$num_rows = $query->num_rows();

if ($num_rows == 0) {
    $response["status"] = "no messages found";
} else {
    $messagesInfo = [];
    $query->bind_result($message);
    while($query->fetch()) {
        $messageInfo = ['message'=> $message];
        $messagesInfo[] =$messageInfo;
    }

    $response["status"] = "success";
    $response["messagesInfo"] = $messagesInfo;

}

echo json_encode($response);
