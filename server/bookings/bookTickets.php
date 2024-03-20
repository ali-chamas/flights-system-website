<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data["seatID"], $data["userID"])) {
            $seatID = $data["seatID"];
            $userID = $data["userID"];

            $check_seat_query = $mysqli->prepare("SELECT isAvailable, isVip, ticketID FROM seats WHERE id = ?");
            $check_seat_query->bind_param("i", $seatID);
            $check_seat_query->execute();
            $check_seat_query->store_result();

            if ($check_seat_query->num_rows == 0) {
                echo json_encode(["status" => "Seat not found"]);
                break;
            }

            $check_seat_query->bind_result($isAvailable, $isVip, $ticketID);
            $check_seat_query->fetch();

            if (!$isAvailable) {
                echo json_encode(["status" => "Seat not available"]);
                break;
            }

            $check_user_query = $mysqli->prepare("SELECT coins FROM users WHERE id = ?");
            $check_user_query->bind_param("i", $userID);
            $check_user_query->execute();
            $check_user_query->store_result();

            if ($check_user_query->num_rows == 0) {
                echo json_encode(["status" => "User not found"]);
                break;
            }

            $check_user_query->bind_result($userCoins);
            $check_user_query->fetch();

            $ticketPriceQuery = $mysqli->prepare("SELECT price FROM tickets WHERE id = ?");
            $ticketPriceQuery->bind_param("i", $ticketID);
            $ticketPriceQuery->execute();
            $ticketPriceQuery->store_result();
            $ticketPriceQuery->bind_result($ticketPrice);
            $ticketPriceQuery->fetch();

            if ($isVip == 1) {
                $ticketPrice *= 2;
            }

            if ($userCoins < $ticketPrice) {
                echo json_encode(["status" => "Insufficient coins"]);
                break;
            }else{
                $ticketPriceQuery = $mysqli->prepare("UPDATE users set coins = $userCoins - $ticketPrice WHERE id = $userID");
            
            $ticketPriceQuery->execute();
            }

            $book_ticket_query = $mysqli->prepare("INSERT INTO bookings (seatID, userID) VALUES (?, ?)");
            $book_ticket_query->bind_param("ii", $seatID, $userID);
            if (!$book_ticket_query->execute()) {
                echo json_encode(["status" => "Failed to book ticket"]);
                break;
            }

            $update_seat_query = $mysqli->prepare("UPDATE seats SET isAvailable = 0 WHERE id = ?");
            $update_seat_query->bind_param("i", $seatID);
            if (!$update_seat_query->execute()) {
                echo json_encode(["status" => "Failed to update seat availability"]);
                break;
            }

            echo json_encode(["status" => "Success"]);
        } else {
            echo json_encode(["status" => "Seat ID and User ID are required"]);
        }
        break;
    default:
        echo json_encode(["status" => "Unsupported request method"]);
        break;
}