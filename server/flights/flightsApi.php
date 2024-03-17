<?PHP
 
 include("../db/connection.php");

 $request_method = $_SERVER["REQUEST_METHOD"];

 switch ($request_method) {
    case "GET":
        if(!empty($_GET["id"])){
            $id = intval($_GET["id"]);
            $response = getFlight($id);
            echo json_encode($response);
        }else{
            $response = getAllFlights();
            echo json_encode($response);
        }
        break;
    case "POST":
        
            $departure= $_POST["departure"];
            $arrival= $_POST["arrival"];
            $departureTime= $_POST["departureTime"];
            $arrivalTime= $_POST["arrivalTime"];
            $image=$_POST['image'];
            $airlineID=$_POST['airlineID'];


            $response = createFlight($departure,$arrival,$departureTime,$arrivalTime,$image,$airlineID);
            echo json_encode($response);
        

        break;
   
    case 'DELETE':
        if(!empty($_GET["id"])){
            $id = intval($_GET["id"]);
            $response = deleteFlight($id);
            echo json_encode($response);
        }else{
            echo json_encode([
                "status"=>"something went wrong",
            ]);
        }
        break;

    case 'PUT':
            if(!empty($_GET["id"])){
                $id = intval($_GET["id"]);
                
                
                $departureTime= $_GET["departureTime"];
                $arrivalTime= $_GET["arrivalTime"];
                
                
                $response = rescheduleFlight($id,$departureTime,$arrivalTime);
                echo json_encode($response);

            }
            break;
    
    default:
        echo json_encode([
            "status"=>"something went wrong",
        ]);
        break;
 }

 function getAllFlights(){
    global $mysqli;
    $query = $mysqli->prepare("select * from flights");
    $query->execute();
    $query->store_result();
    $num_rows = $query->num_rows();

    if($num_rows==0){
        $response['status']='Failed';
        $response['message']= 'no flights available';
    }else{
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
                'airlineID'=> $airlineID
               
            ];

            $flights[] = $flight;
        }
        $response['status']='success';
        $response['flights']= $flights;
    }
    return $response;
 }

 function getFlight($id){
    global $mysqli;
    $query = $mysqli->prepare('select * from flights where id=?');
    $query->bind_param('i', $id);
    $query->execute();
    $query->store_result();
    $query->bind_result($id, $departure, $destination,$departureTime,$arrivalTime,$image,$rating,$airlineID);
    $query->fetch();
    $response['status']="success";
    $response["flight"]= [
        "id"=> $id,
        'departure'=> $departure,
        'destination'=> $destination,
        'departureTime'=> $departureTime,
        'arrivalTime'=> $arrivalTime,
        'image'=> $image,
        'rating'=> $rating,
        'airlineID'=> $airlineID
    ];
    return $response;
 }

 function createFlight($departure,$arrival,$departureTime,$arrivalTime,$image,$airlineID){
    global $mysqli;
    $query = $mysqli->prepare('insert into flights(departure,destination,departureTime,arrivalTime,image,airlineID) values(?,?,?,?,?,?)');
    $query->bind_param('sssssi', $departure, $arrival,$departureTime,$arrivalTime,$image,$airlineID);
    if($query->execute()){
        $response['status']="success";
    }else{
        $response["status"]= "failed";
    }  
    return $response;
    
    
 }

 function deleteFlight($id){
    global $mysqli;
    $query = $mysqli->prepare("DELETE FROM flights WHERE id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $query->store_result();

    $response["status"] = "Success";

    return $response;
 }

 function rescheduleFlight($id,$departureTime,$arrivalTime){
    global $mysqli; 
    $query = $mysqli->prepare("UPDATE flights SET departureTime=?,arrivalTime=? WHERE id=?");
    $query->bind_param("ssi",$departureTime,$arrivalTime, $id);
    if($query->execute()){
        $updateStatus=$mysqli->prepare('UPDATE tickets SET status="scheduled" WHERE flightID=?');
        $updateStatus->bind_param('i',$id);
        if($updateStatus->execute()){
        $response["status"]= "success";
        }
    }else{
        $response["status"]= "failed";
    }
    return $response;
 }