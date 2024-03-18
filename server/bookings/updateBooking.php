<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

if ($request_method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data["id"])) {
        $bookingId = $data["id"];
    
        $check_booking_query = $mysqli->prepare("SELECT seatID FROM bookings WHERE id = ?");
        $check_booking_query->bind_param("i", $bookingId);
        $check_booking_query->execute();
        $check_booking_query->store_result();
    
        if ($check_booking_query->num_rows > 0) {
            $check_booking_query->bind_result($seatID);
            $check_booking_query->fetch();
    
            $get_ticket_price_query = $mysqli->prepare("SELECT ticketID FROM seats WHERE id = ?");
            $get_ticket_price_query->bind_param("i", $seatID);
            $get_ticket_price_query->execute();
            $get_ticket_price_query->store_result();
            $get_ticket_price_query->bind_result($ticketID);
            $get_ticket_price_query->fetch();
    
            $get_ticket_price_query = $mysqli->prepare("SELECT price FROM tickets WHERE id = ?");
            $get_ticket_price_query->bind_param("i", $ticketID);
            $get_ticket_price_query->execute();
            $get_ticket_price_query->store_result();
            $get_ticket_price_query->bind_result($ticketPrice);
            $get_ticket_price_query->fetch();
    
            $refundAmount = $ticketPrice / 2;
    
            $update_user_coins_query = $mysqli->prepare("UPDATE users SET coins = coins + ? WHERE id IN (SELECT userID FROM bookings WHERE id = ?)");
            $update_user_coins_query->bind_param("di", $refundAmount, $bookingId);
            $update_user_coins_query->execute();
    
            $delete_booking_query = $mysqli->prepare("DELETE FROM bookings WHERE id = ?");
            $delete_booking_query->bind_param("i", $bookingId);
    
            if ($delete_booking_query->execute()) {
                echo json_encode(["status" => "Success", "refundAmount" => $refundAmount]);
            } else {
                echo json_encode(["status" => "Failed to delete booking"]);
            }
        } else {
            echo json_encode(["status" => "Booking ID not found"]);
        }
    } else {
        echo json_encode(["status" => "Booking ID is required"]);
    }
}

if ($request_method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data["id"]) && isset($data["newSeatNumber"])) {
        $booking_id = $data["id"];
        $new_seat_number = $data["newSeatNumber"];

        $check_seat_availability_query = $mysqli->prepare("SELECT isAvailable FROM seats WHERE seatNumber = ?");
        $check_seat_availability_query->bind_param("i", $new_seat_number);
        $check_seat_availability_query->execute();
        $check_seat_availability_query->store_result();

        if ($check_seat_availability_query->num_rows > 0) {
            $check_seat_availability_query->bind_result($is_available);
            $check_seat_availability_query->fetch();

            if ($is_available == 1) {
                $update_seat_query = $mysqli->prepare("UPDATE bookings SET seatID = ? WHERE id = ?");
                $update_seat_query->bind_param("ii", $new_seat_number, $booking_id);
                $update_seat_query->execute();

                if ($update_seat_query->affected_rows > 0) {
                    echo json_encode(["status" => "Booking seat updated successfully"]);
                } else {
                    echo json_encode(["status" => "Failed to update booking seat"]);
                }
            } else {
                echo json_encode(["status" => "The requested seat is not available"]);
            }
        } else {
            echo json_encode(["status" => "Seat not found"]);
        }
    } else {
        echo json_encode(["status" => "Booking ID and new seat number are required"]);
    }
}
