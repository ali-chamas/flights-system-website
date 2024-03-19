<?php

include("../db/connection.php");

$request_method = $_SERVER["REQUEST_METHOD"];

$totalSeats = $_POST['totalSeats'];
$date = $_POST['date'];
$price = $_POST['price'];
$flightID = $_POST['flightID'];


$query = $mysqli->prepare('insert into tickets(totalSeats, date, price, flightID) values(?,?,?,?);');
$query->bind_param('isdi', $totalSeats, $date, $price, $flightID);
if ($query->execute()){
    $result = $mysqli->prepare('select id from tickets where totalSeats=? and date = ? and flightID=?');
    $result->bind_param('ssi', $totalSeats,$date,$flightID);
    if( $result->execute()){
        $result->store_result();
        $result->bind_result($fetchedID);
        $result->fetch();
        $addSeats=$mysqli->prepare('insert into seats(seatNumber,ticketID) values(?,?)');
        for($i=0;$i<$totalSeats;$i++){
            $seatName="seat $i";
            $addSeats->bind_param('si',$seatName,$fetchedID);
            if($addSeats->execute()){
                $response['status']='success';
            }else{
                $response['status']= 'failed';
            }
            
        }
    }
   
   

} else {
    $response['status'] = "failed";
    $response['message'] = "ticket wasn't added";
}

echo json_encode($response);