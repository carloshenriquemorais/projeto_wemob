# WEMOB Fleet Optimizer - Smart Load Balancer ⚡🚛

O **WEMOB Fleet Optimizer** é um protótipo de sistema de gerenciamento inteligente para estações de recarga de veículos elétricos (VE), focado na linha **WEMOB** da WEG. 

O projeto resolve o desafio crítico de infraestrutura em galpões logísticos: carregar frotas elétricas sem ultrapassar o limite de demanda de carga do transformador local, utilizando um algoritmo de **balanceamento de carga dinâmico**.

---

## 🚀 O Problema de Negócio
Empresas de logística que eletrificam suas frotas enfrentam o risco de quedas de energia ou multas por picos de demanda quando múltiplos veículos iniciam a recarga simultaneamente. 

## 💡 A Solução
Este software atua como um "cérebro" entre o banco de dados de logística e as estações de recarga. Ele calcula em tempo real o **Score de Urgência** de cada veículo baseado em:
1.  **State of Charge (SoC):** Nível atual da bateria.
2.  **Prioridade Logística:** Definida pela urgência da rota (Alta, Média ou Baixa).
3.  **Limite de Infraestrutura:** O sistema garante que a soma das potências nunca ultrapasse o teto configurado (ex: 150 kW).

---

## 🛠️ Arquitetura Técnica
O projeto utiliza uma arquitetura **Full-Stack desacoplada**, simulando um ambiente de telemetria industrial:

* **Banco de Dados (MySQL):** Armazena o estado real da frota e as configurações de logística.
* **Backend (PHP API):** Processa o algoritmo de balanceamento e serve os dados em formato JSON. Realiza operações de `SELECT` e `UPDATE` via PDO para segurança.
* **Frontend (JavaScript/HTML5/CSS3):** Dashboard dinâmico que consome a API de forma assíncrona (`fetch`), atualizando o status da frota a cada 3 segundos sem recarregar a página.

---

## 📈 Funcionalidades
- [x] **Monitoramento em Tempo Real:** Visualização de bateria e potência alocada por veículo.
- [x] **Simulador de Telemetria:** Sliders para ajustar o nível de bateria via interface.
- [x] **Controle de Prioridade:** Alteração dinâmica da urgência da rota, forçando o algoritmo a redistribuir a carga imediatamente.
- [x] **Proteção de Rede:** Cálculo automático que limita o consumo total ao teto da instalação.

---

## 📂 Como Rodar o Projeto
1.  Clone este repositório na pasta `htdocs` do seu servidor local (XAMPP/WAMP).
2.  Importe o arquivo `database.sql` no seu **phpMyAdmin**.
3.  Configure as credenciais do banco de dados (usuário e senha) no arquivo `api.php` e `atualizar_van.php`.
4.  Acesse `http://localhost/wemob/index.html` no seu navegador.

---

## 👨‍💻 Desenvolvedor
**Carlos Henrique Morais de Oliveira** *Estudante de Análise e Desenvolvimento de Sistemas*.
