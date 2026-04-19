CREATE SCHEMA IF NOT EXISTS wemob_optimizer;
USE wemob_optimizer;

CREATE TABLE estacoes_recarga (
    id_estacao INT PRIMARY KEY AUTO_INCREMENT,
    modelo VARCHAR(50),
    num_serie VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('Disponível', 'Ocupada', 'Manutenção', 'Falha') DEFAULT 'Disponível',
    potencia_max_kw DECIMAL(5,2),
    localizacao_galpao VARCHAR(100)
);

CREATE TABLE veiculos (
    id_veiculo INT PRIMARY KEY AUTO_INCREMENT,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(50),
    capacidade_bateria_kwh DECIMAL(5,2),
    soc_atual INT,
    km_atual INT
);

CREATE TABLE agenda_saida (
    id_agenda INT PRIMARY KEY AUTO_INCREMENT,
    id_veiculo INT,
    horario_saida_previsto DATETIME NOT NULL,
    prioridade_entrega ENUM('Alta', 'Média', 'Baixa'),
    FOREIGN KEY (id_veiculo) REFERENCES veiculos(id_veiculo)
);

CREATE TABLE sessoes_recarga (
    id_sessao INT PRIMARY KEY AUTO_INCREMENT,
    id_estacao INT,
    id_veiculo INT,
    data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_fim DATETIME,
    energia_consumida_kwh DECIMAL(7,3) DEFAULT 0,
    potencia_alocada_kw DECIMAL(5,2),
    custo_estimado DECIMAL(10,2),
    FOREIGN KEY (id_estacao) REFERENCES estacoes_recarga(id_estacao),
    FOREIGN KEY (id_veiculo) REFERENCES veiculos(id_veiculo)
);

SELECT 
    v.placa, 
    v.soc_atual AS bateria_restante, 
    a.horario_saida_previsto,
    e.id_estacao
FROM veiculos v
JOIN agenda_saida a ON v.id_veiculo = a.id_veiculo
JOIN sessoes_recarga s ON v.id_veiculo = s.id_veiculo
JOIN estacoes_recarga e ON s.id_estacao = e.id_estacao
WHERE s.data_fim IS NULL 
ORDER BY a.horario_saida_previsto ASC, v.soc_atual ASC;