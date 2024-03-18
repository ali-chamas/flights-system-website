<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];


if(!empty($_GET['id'])){

    $id=$_GET['id'];
    $query = $mysqli->prepare('select message,sentAT,userID,receiver from messages Where userID=? or receiver = ?');
    $query->bind_param('ii',$id,$id);
    $query->execute();
    $query->store_result();
    $num_rows = $query->num_rows();

    if ($num_rows == 0) {
        $response["status"] = "no messages found";
    } else {
        $messages = [];
        $query->bind_result($message,$sentAt,$userID,$receiver);
        while($query->fetch()) {
            $message=[
                'message'=>$message,
                'sentAt'=>$sentAt,
                'sender'=>$userID,
                'receiver'=>$receiver
            ];
            $messages[] =$message;
        }

        $response["status"] = "success";
        $response["messages"] = $messages;

    }

    echo json_encode($response);  

}else{
    $query = $mysqli->prepare('select message,sentAT,userID,receiver from messages');
    $query->execute();
    $query->store_result();
    $num_rows = $query->num_rows();

    if ($num_rows == 0) {
        $response["status"] = "no messages found";
    } else {
        $messages = [];
        $query->bind_result($message,$sentAt,$userID,$receiver);
        while($query->fetch()) {
            $message=[
                'message'=>$message,
                'sentAt'=>$sentAt,
                'sender'=>$userID,
                'receiver'=>$receiver
            ];
            $messages[] =$message;
        }

        $response["status"] = "success";
        $response["messages"] = $messages;

    }

    echo json_encode($response);
}