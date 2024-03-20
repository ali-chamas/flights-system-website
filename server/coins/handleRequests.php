<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
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
            break;

            case 'DELETE':
                $data = json_decode(file_get_contents('php://input'), true);
                if (isset($data["id"])) {
                    $request_id = $data["id"];
        
                    $delete_request_query = $mysqli->prepare("DELETE FROM requests WHERE id = ?");
                    $delete_request_query->bind_param("i", $request_id);
                    if ($delete_request_query->execute()) {
                        echo json_encode(["status" => "Request deleted successfully"]);
                    } else {
                        echo json_encode(["status" => "Failed to delete request"]);
                    }
                } else {
                    echo json_encode(["status" => "Request ID is required"]);
                }
                break;
        
                case 'PUT':
                    $data = json_decode(file_get_contents('php://input'), true);
                    if (isset($data["id"])) {
                        $request_id = $data["id"];
                        $get_user_id_query = $mysqli->prepare("SELECT userID FROM requests WHERE id = ?");
                        $get_user_id_query->bind_param("i", $request_id);
                        $get_user_id_query->execute();
                        $get_user_id_result = $get_user_id_query->get_result();
                        $row = $get_user_id_result->fetch_assoc();
                        $user_id = $row["userID"];
                        
                        if ($user_id) {
                            $accept_request_query = $mysqli->prepare("UPDATE requests SET isAccepted = 1 WHERE id = ?");
                            $accept_request_query->bind_param("i", $request_id);
                            if ($accept_request_query->execute() && $accept_request_query->affected_rows > 0) {
                                $update_coins_query = $mysqli->prepare("UPDATE users SET coins = coins + (SELECT amount FROM requests WHERE id = ?) WHERE id = ?");
                                $update_coins_query->bind_param("ii", $request_id, $user_id);
                                if ($update_coins_query->execute()) {
                                    echo json_encode(["status" => "Request accepted successfully and coins added"]);
                                    break;
                                }
                            }
                        }
                        echo json_encode(["status" => "Failed to accept request or update coins"]);
                    } else {
                        echo json_encode(["status" => "Request ID is required"]);
                    }
                    break;
                
                default:
                    echo json_encode(["status" => "Invalid request method"]);
                    break;                
        }