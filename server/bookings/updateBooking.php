<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if (!empty($_GET["id"])) {
            $id = intval($_GET["id"]);
            $response = getBookingDetails($id);
        } else {
            $response = getAllBookings();
        }
        break;

    case 'DELETE':
        if (!empty($_GET["id"])) {
            $id = intval($_GET["id"]);
            $response = deleteBooking($id);
        } else {
            $response = ["status" => "Booking ID is required"];
        }
        break;

    case 'POST':
        if (!empty($_GET["id"]) && !empty($_GET["newSeatNumber"])) {
            $id = intval($_GET["id"]);
            $newSeatNumber = $_GET["newSeatNumber"];
            $response = updateBookingSeat($id, $newSeatNumber);
        } else {
            $response = ["status" => "Booking ID and new seat number are required"];
        }
        break;

    default:
        $response = ["status" => "Unsupported request method"];
        break;
}

echo json_encode($response);

function getAllBookings() {
    global $mysqli;
    $query = $mysqli->query("SELECT bookings.id, bookings.seatID, users.name AS passenger_name, flights.departure, flights.destination, seats.seatNumber, tickets.price, tickets.status
                            FROM bookings
                            LEFT JOIN users ON bookings.userID = users.id
                            LEFT JOIN seats ON bookings.seatID = seats.id
                            LEFT JOIN tickets ON seats.ticketID = tickets.id
                            LEFT JOIN flights ON tickets.flightID = flights.id");
    if ($query->num_rows > 0) {
        $bookings = $query->fetch_all(MYSQLI_ASSOC);
        return ["status" => "Success", "bookings" => $bookings];
    } else {
        return ["status" => "No bookings"];
    }
}

function getBookingDetails($id) {
    global $mysqli;
    $query = $mysqli->prepare("SELECT bookings.seatID, users.name AS passenger_name, flights.departure, flights.destination, seats.seatNumber, tickets.price
                                FROM bookings
                                LEFT JOIN users ON bookings.userID = users.id
                                LEFT JOIN seats ON bookings.seatID = seats.id
                                LEFT JOIN tickets ON seats.ticketID = tickets.id
                                LEFT JOIN flights ON tickets.flightID = flights.id
                                WHERE bookings.id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $result = $query->get_result();
    if ($result->num_rows > 0) {
        $booking = $result->fetch_assoc();
        return ["status" => "Success", "booking" => $booking];
    } else {
        return ["status" => "Booking not found"];
    }
}

function deleteBooking($id) {
    global $mysqli;
    $query = $mysqli->prepare("DELETE FROM bookings WHERE id = ?");
    $query->bind_param("i", $id);
    if ($query->execute()) {
        return ["status" => "Success"];
    } else {
        return ["status" => "Failed to delete booking"];
    }
}

function updateBookingSeat($id, $newSeatNumber) {
    global $mysqli;
    $query = $mysqli->prepare("UPDATE tickets SET status = ? WHERE id = ?");
    $query->bind_param("si", $newSeatNumber, $id);
    if ($query->execute()) {
        return ["status" => "Flight status updated successfully"];
    } else {
        return ["status" => "Failed to update booking seat"];
    }
}

