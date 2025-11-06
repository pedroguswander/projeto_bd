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
}