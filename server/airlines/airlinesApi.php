<?PHP
 
 include("../db/connection.php");

 $request_method = $_SERVER["REQUEST_METHOD"];

 switch ($request_method) {
    case "GET":
        if(!empty($_GET["id"])){
            $id = intval($_GET["id"]);
            $response = getAirline($id);
            echo json_encode($response);
        }else{
            $response = getAllAirlines();
            echo json_encode($response);
        }
        break;
    case "POST":
        
            $name= $_POST["name"];
            $logo= $_POST["logo"];
            


            $response = createAirline($name,$logo);
            echo json_encode($response);
        

        break;
   
    case 'DELETE':
        if(!empty($_GET["id"])){
            $id = intval($_GET["id"]);
            $response = deleteAirline($id);
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

 function getAllAirlines(){
    global $mysqli;
    $query = $mysqli->prepare("select * from airlines");
    $query->execute();
    $query->store_result();
    $num_rows = $query->num_rows();

    if($num_rows==0){
        $response['status']='Failed';
        $response['message']= 'no airlines available';
    }else{
        $ailines = [];
        $query->bind_result($id, $name, $logo,$rating);
        while($query->fetch()){
            $airline = [
                'id' => $id,
                'name'=> $name,
                'logo'=> $logo,
                'rating'=> $rating,
                
               
            ];

            $airlines[] = $airline;
        }
        $response['status']='success';
        $response['airlines']= $airlines;
    }
    return $response;
 }

 function getAirline($id){
    global $mysqli;
    $query = $mysqli->prepare('select * from airlines where id=?');
    $query->bind_param('i', $id);
    $query->execute();
    $query->store_result();
    $query->bind_result($id, $name, $logo,$rating);
    $query->fetch();
    $response['status']="success";
    $response["airline"]= [
        "id"=> $id,
        'name'=> $name,
        'logo'=> $logo,
        'rating'=> $rating,
       
    ];
    return $response;
 }

 function createAirline($name,$logo){
    global $mysqli;
    $query = $mysqli->prepare('insert into airlines(name,logo) values(?,?)');
    $query->bind_param('ss', $name,$logo);
    if($query->execute()){
        $response['status']="success";
    }else{
        $response["status"]= "failed";
    }  
    return $response;
    
    
 }

 function deleteAirline($id){
    global $mysqli;
    $query = $mysqli->prepare("DELETE FROM airlines WHERE id = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $query->store_result();

    $response["status"] = "Success";

    return $response;
 }

 