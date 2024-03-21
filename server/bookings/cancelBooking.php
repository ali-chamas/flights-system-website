<?php
include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'DELETE':
        $bookingId = $_GET["id"];
        if (!empty($bookingId)) {
            echo json_encode(deleteBookingAndRefund($bookingId));
        } else {
            echo json_encode(["status" => "Booking ID is required"]);
        }
        break;
}

function deleteBookingAndRefund($bookingId) {
    global $mysqli;
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
            return ["status" => "Success", "refundAmount" => $refundAmount];
        } else {
            return ["status" => "Failed to delete booking"];
        }
    } else {
        return ["status" => "Booking ID not found"];
    }
}

