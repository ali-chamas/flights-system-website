<?php
include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];
$userID=$_GET['id'];

$query = $mysqli->prepare("
select flightsreviews.*,flights.departure,flights.destination
from flightsreviews
join flights on flights.id=flightsreviews.flightID
where flightsreviews.userID=?");
$query->bind_param("i", $userID);
$query->execute();
$query->store_result();
$num_rows = $query->num_rows();

if($num_rows==0){
    $response['status']='Failed';
    $response['message']= 'no reviews available';
} else {
    $reviews = [];
    $query->bind_result($id, $rating, $review, $createdAT, $userID, $flightID, $departure,$destination);
    while($query->fetch()) {
        $review = [
            'id' => $id,
            'rating' => $rating,
            'review' => $review,
            'createdAT' => $createdAT,
            'userID' => $userID,
            'flightID' => $flightID,
            'departure' => $departure,
            'destination'=> $destination
        ];
        $reviews[] = $review;
    }
    $response['status'] = 'success';
    $response['reviews'] = $reviews;
}  

echo json_encode($response);