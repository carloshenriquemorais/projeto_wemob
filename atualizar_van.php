<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "weg_wemob";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    
    $id = $_POST['id_veiculo'];

    if (isset($_POST['soc_atual'])) {
        $sql = "UPDATE veiculos SET soc_atual = :valor WHERE id_veiculo = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['valor' => $_POST['soc_atual'], 'id' => $id]);
    }

    if (isset($_POST['prioridade'])) {
        $sql = "UPDATE agenda_saida SET prioridade_entrega = :valor WHERE id_veiculo = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['valor' => $_POST['prioridade'], 'id' => $id]);
    }

    echo json_encode(["status" => "sucesso"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "erro", "msg" => $e->getMessage()]);
}
?>