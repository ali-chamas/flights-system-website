<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        $response = getRequests($mysqli);
        echo json_encode($response);
        break;

    case 'DELETE':
        if (!empty($_GET["id"])) {
            $id = intval($_GET["id"]);
            $response = deleteRequest($id);
            echo json_encode($response);
        } else {
            echo json_encode(["status" => "Request ID is required"]);
        }
        break;

    case 'PUT':
        if (!empty($_GET["id"])) {
            $request_id = intval($_GET["id"]);
            $response = acceptRequestAndUpdateCoins($request_id, $mysqli);
            echo json_encode($response);
        } else {
            echo json_encode(["status" => "Request ID is required"]);
        }
        break;     
}

function deleteRequest($id) {
    global $mysqli;

    $delete_request_query = $mysqli->prepare("DELETE FROM requests WHERE id = ?");
    
    $delete_request_query->bind_param("i", $id);

    if ($delete_request_query->execute()) {
        return ["status" => "Request deleted successfully"];
    } else {
        return ["status" => "Failed to delete request"];
    }
} 

function acceptRequestAndUpdateCoins($request_id, $mysqli) {
    $accept_request_query = $mysqli->prepare("UPDATE requests SET isAccepted = 1 WHERE id = ?");
    $accept_request_query->bind_param("i", $request_id);
    
    if ($accept_request_query->execute() && $accept_request_query->affected_rows > 0) {
        $update_coins_query = $mysqli->prepare("UPDATE users 
                                                SET coins = coins + (SELECT amount FROM requests WHERE id = ?)
                                                WHERE id = (SELECT userID FROM requests WHERE id = ?)");
        $update_coins_query->bind_param("ii", $request_id, $request_id);
        
        if ($update_coins_query->execute()) {
            return ["status" => "Request accepted successfully and coins added"];
        }
    }
    return ["status" => "Failed to accept request or update coins"];
}

function getRequests($mysqli) {
    $get_requests_query = "SELECT requests.*, users.email FROM requests JOIN users ON users.id = requests.userID";
    $result = $mysqli->query($get_requests_query);

    if ($result) {
        $requests = $result->fetch_all(MYSQLI_ASSOC);
        return ["status" => "Success", "requests" => $requests];
    } else {
        return ["status" => "Failed to fetch requests"];
    }
}