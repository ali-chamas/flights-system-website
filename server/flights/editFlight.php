<?php
include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

if($request_method=="POST"){

    $id = $_POST['id'];
    $departure = $_POST['departure'];
    $arrival = $_POST['arrival'];
    $departureTime = $_POST['departureTime'];
    $arrivalTime = $_POST['arrivalTime'];
    $image = $_POST['image'];
    $airlineID = $_POST['airlineID'];

    $response = editFlight($id, $departure, $arrival, $departureTime, $arrivalTime, $image, $airlineID);
    
    echo json_encode($response);
}

function editFlight($id, $departure, $arrival, $departureTime, $arrivalTime, $image, $airlineID) {
    global $mysqli;
    $query = $mysqli->prepare("UPDATE flights SET departure=?, destination=?, departureTime=?, arrivalTime=?, image=?, airlineID=? WHERE id=?");
    $query->bind_param("sssssii", $departure, $arrival, $departureTime, $arrivalTime, $image, $airlineID, $id);
    if ($query->execute()) {
        $response["status"] = "success";
    } else {
        $response["status"] = "failed";
    }
    return $response;
}
