<?php
include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];
$userID=$_GET['id'];

$query = $mysqli->prepare("
select airlinesreviews.*,airlines.name
from airlinesreviews
join airlines on airlines.id=airlinesreviews.airlineID
where airlinesreviews.userID=?");
$query->bind_param("i", $userID);
$query->execute();
$query->store_result();
$num_rows = $query->num_rows();

if($num_rows==0){
    $response['status']='Failed';
    $response['message']= 'no reviews available';
} else {
    $reviews = [];
    $query->bind_result($id, $rating, $review, $createdAT, $userID, $airlineID, $airlineName);
    while($query->fetch()) {
        $review = [
            'id' => $id,
            'rating' => $rating,
            'review' => $review,
            'createdAT' => $createdAT,
            'userID' => $userID,
            'airlineID' => $airlineID,
            'airlineName' => $airlineName,
            
        ];
        $reviews[] = $review;
    }
    $response['status'] = 'success';
    $response['reviews'] = $reviews;
}  

echo json_encode($response);