<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        $user_id = $_GET['user_id'];
        $check_admin_query = $mysqli->prepare("SELECT isAdmin FROM users WHERE id = ?");
        $check_admin_query->bind_param("i", $user_id);
        $check_admin_query->execute();
        $check_admin_query->store_result();

        if ($check_admin_query->num_rows > 0) {
            $check_admin_query->bind_result($is_admin);
            $check_admin_query->fetch();
            if ($is_admin == 1) {
                $get_requests_query = "SELECT * FROM requests";
                $result = $mysqli->query($get_requests_query);

                if ($result) {
                    $requests = [];
                    while ($row = $result->fetch_assoc()) {
                        $requests[] = $row;
                    }
                    echo json_encode(["status" => "Success", "requests" => $requests]);
                } else {
                    echo json_encode(["status" => "Failed to fetch requests"]);
                }
            } else {
                echo json_encode(["status" => "User is not authorized to view requests"]);
            }
        } else {
            echo json_encode(["status" => "User not found"]);
        }
        break;
        
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data["id"])) {
            $user_id = $data["user_id"];
            $request_id = $data["id"];
            $check_admin_query = $mysqli->prepare("SELECT isAdmin FROM users WHERE id = ?");
            $check_admin_query->bind_param("i", $user_id);
            $check_admin_query->execute();
            $check_admin_query->store_result();

            if ($check_admin_query->num_rows > 0) {
                $check_admin_query->bind_result($is_admin);
                $check_admin_query->fetch();
                if ($is_admin == 1) {
                    $delete_request_query = $mysqli->prepare("DELETE FROM requests WHERE id = ?");
                    $delete_request_query->bind_param("i", $request_id);
                    if ($delete_request_query->execute()) {
                        echo json_encode(["status" => "Request deleted successfully"]);
                    } else {
                        echo json_encode(["status" => "Failed to delete request"]);
                    }
                } else {
                    echo json_encode(["status" => "User is not authorized to delete requests"]);
                }
            } else {
                echo json_encode(["status" => "User not found"]);
            }
        } else {
            echo json_encode(["status" => "Request ID is required"]);
        }
        break;
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data["id"])) {
                $request_id = $data["id"];
                $user_id = $data["user_id"]; // Assuming the user ID is also included in the PUT request
                $check_admin_query = $mysqli->prepare("SELECT isAdmin FROM users WHERE id = ?");
                $check_admin_query->bind_param("i", $user_id);
                $check_admin_query->execute();
                $check_admin_query->store_result();
        
                if ($check_admin_query->num_rows > 0) {
                    $check_admin_query->bind_result($is_admin);
                    $check_admin_query->fetch();
                    if ($is_admin == 1) {
                        $accept_request_query = $mysqli->prepare("UPDATE requests SET isAccepted = 1 WHERE id = ?");
                        $accept_request_query->bind_param("i", $request_id);
                        if ($accept_request_query->execute()) {
                            if ($accept_request_query->affected_rows > 0) {
                                // Now update the user's coins
                                $update_coins_query = $mysqli->prepare("UPDATE users SET coins = coins + (SELECT amount FROM requests WHERE id = ?) WHERE id = ?");
                                $update_coins_query->bind_param("ii", $request_id, $user_id);
                                if ($update_coins_query->execute()) {
                                    echo json_encode(["status" => "Request accepted successfully and coins added"]);
                                } else {
                                    echo json_encode(["status" => "Request accepted successfully but failed to update coins"]);
                                }
                            } else {
                                echo json_encode(["status" => "Failed to accept request"]);
                            }
                        } else {
                            echo json_encode(["status" => "Failed to accept request"]);
                        }
                    } else {
                        echo json_encode(["status" => "User is not authorized to accept requests"]);
                    }
                } else {
                    echo json_encode(["status" => "User not found"]);
                }
            } else {
                echo json_encode(["status" => "Request ID is required"]);
            }
            break;
        
}