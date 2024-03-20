<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        if (isset($_GET["id"])) {
            $id = intval($_GET["id"]);
            $response = getBooking($id);
        } else {
            $response = getAllBookings();
        }
        break;

    case 'POST':
        if (isset($_POST["id"])) {
            $bookingId = $_POST["id"];
            $response = deleteBooking($bookingId);
        } else {
            $response = ["status" => "Booking ID is required"];
        }
        break;

    case 'PUT':
        if (isset($_GET["id"]) && isset($_GET["newSeatNumber"])) {
            $bookingId = intval($_GET["id"]);
            $newSeatNumber = intval($_GET["newSeatNumber"]);
            $response = updateBookingSeat($bookingId, $newSeatNumber);
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
    $query = $mysqli->query("SELECT * FROM bookings");
    if ($query->num_rows > 0) {
        $bookings = $query->fetch_all(MYSQLI_ASSOC);
        return ["status" => "Success", "bookings" => $bookings];
    } else {
        return ["status" => "No bookings"];
    }
}

function getBooking($id) {
    global $mysqli;
    $query = $mysqli->prepare("SELECT * FROM bookings WHERE id = ?");
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
    $query = $mysqli->prepare("UPDATE bookings SET seatID = ? WHERE id = ?");
    $query->bind_param("ii", $newSeatNumber, $id);
    if ($query->execute()) {
        return ["status" => "Booking seat updated successfully"];
    } else {
        return ["status" => "Failed to update booking seat"];
    }
}
