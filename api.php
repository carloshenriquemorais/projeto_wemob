<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$user = "root";       
$pass = ""; 
$dbname = "weg_wemob";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["erro" => "Conexão falhou: " . $e->getMessage()]);
    exit;
}

$sql = "SELECT v.placa, v.soc_atual as bateria, a.prioridade_entrega as prioridade 
        FROM veiculos v
        JOIN agenda_saida a ON v.id_veiculo = a.id_veiculo";

$stmt = $pdo->prepare($sql);
$stmt->execute();
$frota_db = $stmt->fetchAll(PDO::FETCH_ASSOC);

$capacidade_maxima = 150; 
$frota_processada = [];

foreach ($frota_db as $van) {
    $multiplicador = 1.0;
    if ($van['prioridade'] == 'Alta') $multiplicador = 2.0;
    if ($van['prioridade'] == 'Baixa') $multiplicador = 0.5;
    
    $urgencia = ($van['bateria'] >= 100) ? 0 : (100 - $van['bateria']) * $multiplicador;
    
    $van['urgencia'] = $urgencia;
    $van['potenciaAlocada'] = 0;
    $frota_processada[] = $van;
}

usort($frota_processada, function($a, $b) {
    return $b['urgencia'] <=> $a['urgencia'];
});

foreach ($frota_processada as &$van) {
    if ($van['urgencia'] > 0 && $capacidade_maxima >= 50) {
        $van['potenciaAlocada'] = 50;
        $capacidade_maxima -= 50;
    } elseif ($van['urgencia'] > 0 && $capacidade_maxima > 0) {
        $van['potenciaAlocada'] = $capacidade_maxima;
        $capacidade_maxima = 0;
    }
}

echo json_encode($frota_processada);
?>