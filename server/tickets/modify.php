<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

$status = $_POST["status"];
$totalSeats = $_POST['totalSeats'];


if (!empty($_GET["id"])) {
    $id = intval($_GET["id"]);
    $query = $mysqli->prepare('update tickets set status = ?, totalSeats = ?  where id= ?;');
    $query->bind_param('sii', $status, $totalSeats, $id);
    if ($query->execute()){
        $response['status'] = "success";
        $response['message'] = "ticket was updated successfully";
    } else {
        $response['status'] = "failed";
        $response['message'] = "ticket wasn't updated";
    }
    echo json_encode($response);

} else {
    echo json_encode([
        "status" => "something went wrong",
    ]);
}


function getTicket($id) {
    global $mysqli;
    $query = $mysqli->prepare("select * from tickets where id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $query->store_result();
    $query->bind_result($id, $totalSeats, $date, $price, $status, $flightID);
    $query->fetch();

    $response["status"] = "success";
    $response["ticket"] = [
            'id' => $id,
            'totalSeats' => $totalSeats,
            'date' => $date,
            'price' => $price,
            'status' => $status,
            'flightID' => $flightID
    ];
    return $response;
}