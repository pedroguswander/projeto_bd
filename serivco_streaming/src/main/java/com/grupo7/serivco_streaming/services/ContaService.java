package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.Conta; // Importe o modelo
import com.grupo7.serivco_streaming.repositories.ContaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional; // Importar Optional

@Service
public class ContaService {

    private final ContaRepository contaRepository;

    @Autowired
    public ContaService(ContaRepository contaRepository) {
        this.contaRepository = contaRepository;
    }

    // ### MÉTODOS EXISTENTES ###

    public List<Map<String, Object>> buscarDetalhesContas() {
        return contaRepository.buscarTodasContasDetalhesSemDTO();
    }

    public void atualizarStatus(int usuarioId, String novoStatus) {
        // Lógica de negócio (se houver) iria aqui.
        contaRepository.atualizarStatusConta(usuarioId, novoStatus);
    }


    // ### NOVOS MÉTODOS CRUD ###

    /**
     * CREATE
     * Cria uma nova conta.
     */
    public Conta criarConta(Conta conta) {
        // Validações de negócio (ex: verificar se fkUsuarioId já existe) iriam aqui.
        return contaRepository.create(conta);
    }

    /**
     * READ (By ID)
     * Busca uma conta por ID.
     */
    public Optional<Conta> buscarContaPorId(int id) {
        return contaRepository.findById(id);
    }

    /**
     * READ (All)
     * Lista todas as contas.
     */
    public List<Conta> listarTodasContas() {
        return contaRepository.findAll();
    }

    /**
     * UPDATE
     * Atualiza uma conta. Retorna 'true' se foi bem-sucedido.
     */
    public boolean atualizarConta(int id, Conta conta) {
        // Garante que o ID do objeto é o mesmo do path (URL)
        conta.setCodigo(id);

        // O método update do jdbc retorna o n° de linhas afetadas
        int linhasAfetadas = contaRepository.update(conta);

        // Se linhasAfetadas > 0, a atualização funcionou
        return linhasAfetadas > 0;
    }

    /**
     * DELETE
     * Deleta uma conta. Retorna 'true' se foi bem-sucedido.
     */
    public boolean deletarConta(int id) {
        int linhasAfetadas = contaRepository.deleteById(id);
        return linhasAfetadas > 0;
    }
}