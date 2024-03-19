<?php
include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

$airlineID=$_GET['id'];

$query = $mysqli->prepare("
select airlinesreviews.*, users.name
from airlinesreviews
join users on users.id=airlinesreviews.userID
where airlinesreviews.airlineID=?");
$query->bind_param("i", $airlineID);
$query->execute();
$query->store_result();
$num_rows = $query->num_rows();

if($num_rows==0){
    $response['status']='Failed';
    $response['message']= 'no reviews available';
} else {
    $reviews = [];
    $query->bind_result($id, $rating, $review, $createdAT, $userID, $airlineID, $userName);
    while($query->fetch()) {
        $review = [
            'id' => $id,
            'rating' => $rating,
            'review' => $review,
            'createdAT' => $createdAT,
            'userID' => $userID,
            'airlineID' => $airlineID,
            'userName' => $userName
        ];
        $reviews[] = $review;
    }
    $response['status'] = 'success';
    $response['reviews'] = $reviews;
}  

echo json_encode($response);