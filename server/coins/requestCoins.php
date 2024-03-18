<?php
include("../db/connection.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['userID']) && isset($data['amount'])) {
        $userID = $data['userID'];
        $amount = $data['amount'];

        $check_user_query = $mysqli->prepare("SELECT id FROM users WHERE id = ?");
        $check_user_query->bind_param("i", $userID);
        $check_user_query->execute();
        $check_user_query->store_result();

        if ($check_user_query->num_rows > 0) {
            
            $insert_request_query = $mysqli->prepare("INSERT INTO requests (userID, amount) VALUES (?, ?)");
            $insert_request_query->bind_param("ii", $userID, $amount);
            if ($insert_request_query->execute()) {
                echo json_encode(["status" => "Request submitted successfully"]);
            } else {
                echo json_encode(["status" => "Failed to submit request"]);
            }
        } else {
            echo json_encode(["status" => "User not found"]);
        }
    } else {
        echo json_encode(["status" => "User ID and amount are required"]);
    }
} else {
    echo json_encode(["status" => "Unsupported request method"]);
}
