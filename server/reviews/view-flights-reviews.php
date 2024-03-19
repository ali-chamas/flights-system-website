<?php
include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

$query = $mysqli->prepare("
select flightsreviews.*, users.name
from flightsreviews
join users on users.id=flightsreviews.userID
where flightsreviews.userID=users.id");
$query->execute();
$query->store_result();
$num_rows = $query->num_rows();

if($num_rows==0){
    $response['status']='Failed';
    $response['message']= 'no reviews available';
} else {
    $reviews = [];
    $query->bind_result($id, $rating, $review, $createdAT, $userID, $flightID, $userName);
    while($query->fetch()) {
        $review = [
            'id' => $id,
            'rating' => $rating,
            'review' => $review,
            'createdAT' => $createdAT,
            'userID' => $userID,
            'flightID' => $flightID,
            'userName' => $userName
        ];
        $reviews[] = $review;
    }
    $response['status'] = 'success';
    $response['reviews'] = $reviews;
}  

echo json_encode($response);