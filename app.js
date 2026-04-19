let controlesCriados = false;

async function buscarDadosDoPHP() {
    try {
        const resposta = await fetch('api.php');
        
        if (!resposta.ok) throw new Error("Erro ao acessar api.php");

        const frotaReal = await resposta.json();
        
        renderizarDashboard(frotaReal);
        
        if (!controlesCriados) {
            renderizarControles(frotaReal);
            controlesCriados = true;
        }
        
        atualizarLabelsControles(frotaReal);

    } catch (erro) {
        console.error("Erro na integração:", erro);
    }
}

function renderizarDashboard(frota) {
    const grid = document.getElementById('grid-estacoes');
    if (!grid) return;
    
    let consumoTotal = 0;
    grid.innerHTML = ''; 

    frota.forEach((van) => {
        consumoTotal += parseFloat(van.potenciaAlocada) || 0;

        let classeCSS = van.potenciaAlocada > 0 ? "carregando" : "";
        if (van.prioridade === "Alta" && van.potenciaAlocada < 50) classeCSS = "urgente";

        grid.innerHTML += `
            <div class="card-van ${classeCSS}">
                <div class="card-header">
                    <span class="placa">${van.placa}</span>
                    <span class="prioridade" style="background: ${van.prioridade === 'Alta' ? '#FF3D00' : '#333'}">
                        ${van.prioridade}
                    </span>
                </div>
                <div class="card-body">
                    <div>
                        <p style="font-size: 11px; color: #888; text-transform: uppercase;">Bateria</p>
                        <span class="dado-bateria">${van.bateria}%</span>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 11px; color: #888; text-transform: uppercase;">Potência Liberada</p>
                        <span class="dado-potencia">${van.potenciaAlocada} kW</span>
                    </div>
                </div>
            </div>`;
    });

    document.getElementById('consumo-total').innerText = consumoTotal + " kW";
}

function renderizarControles(frota) {
    const controlesDiv = document.getElementById('controles-vans');
    if (!controlesDiv) return;
    
    controlesDiv.innerHTML = ''; 

    frota.forEach((van, index) => {
        const idReal = index + 1;
        
        controlesDiv.innerHTML += `
            <div class="controle-grupo" style="margin-bottom: 25px; background: #2a2a2a; padding: 15px; border-radius: 8px; border: 1px solid #444;">
                <h4 style="color: #00579D; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 5px; font-size: 14px;">
                    Configurações: ${van.placa}
                </h4>
                
                <div class="input-row" style="margin-bottom: 15px;">
                    <label style="display:block; font-size:11px; color:#aaa; margin-bottom:5px;">
                        Simular Bateria: <strong id="val-${index}" style="color:#fff;">${van.bateria}%</strong>
                    </label>
                    <input type="range" min="0" max="100" value="${van.bateria}" 
                           style="width: 100%; cursor: pointer;"
                           oninput="document.getElementById('val-${index}').innerText = this.value + '%'"
                           onchange="enviarDados(${idReal}, 'soc_atual', this.value)">
                </div>

                <div class="input-row">
                    <label style="display:block; font-size:11px; color:#aaa; margin-bottom:5px;">Prioridade da Rota</label>
                    <select style="width:100%; background:#121212; color:#fff; border:1px solid #555; padding:6px; border-radius:4px;"
                            onchange="enviarDados(${idReal}, 'prioridade', this.value)">
                        <option value="Baixa" ${van.prioridade === 'Baixa' ? 'selected' : ''}>Baixa</option>
                        <option value="Média" ${van.prioridade === 'Média' ? 'selected' : ''}>Média</option>
                        <option value="Alta" ${van.prioridade === 'Alta' ? 'selected' : ''}>Alta</option>
                    </select>
                </div>
            </div>`;
    });
}

function atualizarLabelsControles(frota) {
    frota.forEach((van, index) => {
        const label = document.getElementById(`val-${index}`);
        if (label) label.innerText = van.bateria + "%";
    });
}

async function enviarDados(id, campo, valor) {
    console.log(`📡 Enviando atualização: Van ${id} -> ${campo}: ${valor}`);
    
    let formulario = new FormData();
    formulario.append('id_veiculo', id);
    formulario.append(campo, valor);

    try {
        await fetch('atualizar_van.php', {
            method: 'POST',
            body: formulario
        });
        
        buscarDadosDoPHP(); 
    } catch (e) {
        console.error("❌ Falha ao atualizar banco de dados:", e);
    }
}

buscarDadosDoPHP();
setInterval(buscarDadosDoPHP, 3000);