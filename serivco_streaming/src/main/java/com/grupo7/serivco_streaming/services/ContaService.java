package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.repositories.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Service responsável pela lógica de negócio relacionada à Conta.
 */
@Service // Marca a classe como um Service do Spring
public class ContaService {

    private final ContaRepository contaRepository;

    @Autowired
    public ContaService(ContaRepository contaRepository) {
        this.contaRepository = contaRepository;
    }

    public List<Map<String, Object>> buscarDetalhesContas() {
        // Chama o método do Repository que retorna o Map genérico
        return contaRepository.buscarTodasContasDetalhesSemDTO();
    }

    /**
     * Atualiza o status da assinatura de um usuário.
     * Envolve a validação do status e a chamada ao Repositório.
     * * @param usuarioId O ID do usuário.
     * @param novoStatus O novo status da conta.
     * @throws IllegalArgumentException Se o status for inválido (vindo do Repository).
     */
    public void atualizarStatus(int usuarioId, String novoStatus) {

        // *Nota: A validação de status já está na Stored Procedure e é tratada no Repository.
        // Se houvesse lógica de negócio adicional (ex: enviar email ao atualizar para 'Cancelada'),
        // ela iria aqui.

        // Chama o método do Repository, delegando a execução da Stored Procedure
        contaRepository.atualizarStatusConta(usuarioId, novoStatus);
    }

    public List<Map<String, Object>> getMonthlyAccountCreationCounts() {
        // Obtém os dados brutos do repositório.
        List<Map<String, Object>> raw = contaRepository.getAccountCountsByMonth();

        // Transforma cada registro em um Map com campos separados: quantidade, mes, ano
        java.util.List<Map<String, Object>> transformed = new java.util.ArrayList<>();

        for (Map<String, Object> row : raw) {
            Object anoMesObj = row.get("Ano_Mes_Criacao");
            Object totalObj = row.get("Total_Contas");

            String anoMes = anoMesObj != null ? anoMesObj.toString() : null;
            Integer ano = null;
            Integer mes = null;

            if (anoMes != null && anoMes.contains("-")) {
                String[] parts = anoMes.split("-", 2);
                try {
                    ano = Integer.parseInt(parts[0]);
                    mes = Integer.parseInt(parts[1]);
                } catch (NumberFormatException e) {
                    // Se parsing falhar, apenas deixamos ano/mes nulos
                }
            }

            Integer quantidade = null;
            if (totalObj instanceof Number) {
                quantidade = ((Number) totalObj).intValue();
            } else if (totalObj != null) {
                try {
                    quantidade = Integer.parseInt(totalObj.toString());
                } catch (NumberFormatException ignored) {
                }
            }

            java.util.Map<String, Object> item = new java.util.HashMap<>();
            item.put("quantidade", quantidade);
            item.put("mes", mes);
            item.put("ano", ano);

            transformed.add(item);
        }

        return transformed;
    }
}