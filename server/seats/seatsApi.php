<?PHP
 
 include("../db/connection.php");

 $request_method = $_SERVER["REQUEST_METHOD"];
$ticketID=$_GET['id'];

 $query = $mysqli->prepare("
    SELECT * from seats where ticketID = ?
 ");
 $query->bind_param("i", $ticketID);
    $query->execute();
    $query->store_result();
    $num_rows = $query->num_rows();

    if($num_rows==0){
        $response['status']='Failed';
        $response['message']= 'no seats available';
    }else{
        $seats = [];
        $query->bind_result($id, $seatNumber, $isAvailable,$isVip,$ticketID);
        while($query->fetch()){
            $seat = [
                'id' => $id,
                'seatNumber'=>$seatNumber,
                'isAvailable'=>$isAvailable,
                'isVip'=>$isVip,
                'ticketID'=>$ticketID
                
               
            ];

            $seats[] = $seat;
        }

        $response['status']='success';
        $response['seats']= $seats;
        
    }
    echo json_encode($response);