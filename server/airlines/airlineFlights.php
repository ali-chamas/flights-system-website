<?PHP
 
 include("../db/connection.php");

 $airlineID=$_GET['id'];

    $query = $mysqli->prepare('select * from flights where airlineID=?');
    $query->bind_param('i', $airlineID);
    $query->execute();
    $query->store_result();
    $num_rows = $query->num_rows();

    if($num_rows==0){
        $response['status']='Failed';
        $response['message']= 'no reviews available';
    } else {
        $flights = [];
        $query->bind_result($id, $departure, $destination,$departureTime,$arrivalTime,$image,$rating,$airlineID);
        while($query->fetch()){
            $flight = [
                'id' => $id,
                'departure'=> $departure,
                'destination'=> $destination,
                'departureTime'=> $departureTime,
                'arrivalTime'=> $arrivalTime,
                'image'=> $image,
                'rating'=> $rating,
                'airlineID'=> $airlineID,
                
            ];

            $flights[] = $flight;
        }
        $response['status']='success';
        $response['flights']= $flights;
    }  
    echo json_encode($response);

 