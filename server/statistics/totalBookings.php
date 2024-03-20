<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':

        $response = getTotalUsers();
        break;

    default:
        $response = ["status" => "Unsupported request method"];
        break;
}

echo json_encode($response);

function getTotalUsers() {
    global $mysqli;
    $query = $mysqli->query("SELECT * from users ");
    if ($query) {
        $users = $query->fetch_all(MYSQLI_ASSOC);
        $totalUsers = count($users);
        return ["status" => "Success", "totalUsers" => $totalUsers];
    } else {
        return ["status" => "No users", "totalUsers" => 0];
    }
}

