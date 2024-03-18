<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

if(!empty($_GET["id"])) {
    $id = intval($_GET["id"]);
    $query = $mysqli->prepare("delete from tickets where id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $query->store_result();

    $response["status"] = "success";
    echo json_encode($response);
} else {
    echo json_encode([
        "status" => "something went wrong",
    ]);
}

