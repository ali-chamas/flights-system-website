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

   
    
    default:
        echo json_encode([
            "status"=>"something went wrong",
        ]);
        break;
 }

 function getAllFlights(){
    global $mysqli;
    $query = $mysqli->prepare("
    select flights.*,airlines.name
    from flights 
    join airlines on airlines.id=flights.airlineID
    Where flights.airlineID=airlines.id
    ");
    $query->execute();
    $query->store_result();
    $num_rows = $query->num_rows();

    if($num_rows==0){
        $response['status']='Failed';
        $response['message']= 'no flights available';
    }else{
        $flights = [];
        $query->bind_result($id, $departure, $destination,$departureTime,$arrivalTime,$image,$rating,$airlineID,$airlineName);
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
                'airlineName'=>$airlineName
               
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
    $query = $mysqli->prepare('select flights.*,airlines.name,airlines.logo
     from flights
     join airlines on airlines.id=flights.airlineID
     where flights.id=?');
    $query->bind_param('i', $id);
    $query->execute();
    $query->store_result();
    $query->bind_result($id, $departure, $destination,$departureTime,$arrivalTime,$image,$rating,$airlineID,$airlineName,$airlineImage);
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
        'airlineID'=> $airlineID,
        'airlineName'=>$airlineName,
        'airlineImage'=>$airlineImage
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

 