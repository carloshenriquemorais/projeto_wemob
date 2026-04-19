import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Comparator;

@Service
public class WemobLoadBalancerService {

    private static final double MAX_FACILITY_POWER_KW = 150.0; 
    
    private final SessaoRecargaRepository repository;

    public WemobLoadBalancerService(SessaoRecargaRepository repository) {
        this.repository = repository;
    }

    @Scheduled(fixedRate = 300000) 
    public void rebalancearCargaDaFrota() {
        
        List<SessaoAtivaDTO> sessoesAtivas = repository.buscarCarrosPlugados();

        sessoesAtivas.sort(Comparator.comparingDouble(this::calcularScorePrioridade).reversed());

        double potenciaDisponivel = MAX_FACILITY_POWER_KW;

        for (SessaoAtivaDTO sessao : sessoesAtivas) {
            if (potenciaDisponivel <= 0) {
                sessao.setPotenciaAlocadaKw(0.0);
            } else {
                double potenciaLiberada = Math.min(sessao.getPotenciaMaxEstacao(), potenciaDisponivel);
                sessao.setPotenciaAlocadaKw(potenciaLiberada);
                
                potenciaDisponivel -= potenciaLiberada;
            }
            
            repository.savePotenciaAlocada(sessao);
        }
        
        System.out.println("Rebalanceamento concluído. Potência ociosa: " + potenciaDisponivel + "kW");
    }

    private double calcularScorePrioridade(SessaoAtivaDTO sessao) {
        double bateriaFaltantePorcento = 100.0 - sessao.getSocAtual();
        
        double horasAteSaida = ChronoUnit.MINUTES.between(
            LocalDateTime.now(), sessao.getHorarioSaidaPrevisto()
        ) / 60.0;

        if (horasAteSaida <= 0) return 9999.0;

        double multiplicadorLogistica = sessao.getPrioridadeEntrega().equals("Alta") ? 1.5 : 1.0;

        return (bateriaFaltantePorcento / horasAteSaida) * multiplicadorLogistica;
    }
}

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class FrotaController {

    private final WemobLoadBalancerService servico;

    public FrotaController(WemobLoadBalancerService servico) {
        this.servico = servico;
    }

    @GetMapping("/api/status")
    public List<SessaoAtivaDTO> obterStatusEmTempoReal() {
        return servico.buscarCarrosPlugados(); 
    }
}