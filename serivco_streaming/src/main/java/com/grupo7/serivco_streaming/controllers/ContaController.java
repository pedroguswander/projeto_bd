package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.services.ContaService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller responsável pelos endpoints da API para gerenciamento de Contas.
 */
@RestController
@RequestMapping("/api/contas") // URL base: /api/contas
public class ContaController {

    private final ContaService contaService;

    @Autowired
    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    }

    /**
     * Endpoint HTTP PUT para atualizar o status da conta de um usuário.
     * * Exemplo de requisição: PUT /api/contas/usuario/10/status
     * Corpo (JSON): { "novoStatus": "Cancelada" }
     * * @param usuarioId O ID do usuário (vindo do Path da URL).
     * @param request Um objeto simples para encapsular o novo status do corpo da requisição.
     * @return ResponseEntity com o status HTTP da operação.
     */
    @PutMapping("/usuario/{usuarioId}/status")
    public ResponseEntity<Void> atualizarStatusConta(
            @PathVariable int usuarioId,
            @RequestBody StatusUpdate request) {

            // Chama o método do Service
            contaService.atualizarStatus(usuarioId, request.getNovoStatus());

            // Se a chamada for bem-sucedida, retorna 204 No Content
            return ResponseEntity.noContent().build();

    }

    @GetMapping("/detalhes-usuario-conta")
    public ResponseEntity<List<Map<String, Object>>> listarDetalhesContas() {

        List<Map<String, Object>> resultados = contaService.buscarDetalhesContas();

        // Retorna 200 OK com a lista de resultados no corpo
        return ResponseEntity.ok(resultados);
    }

    // Classe auxiliar para receber o corpo da requisição
    @Getter
    @Setter
    public static class StatusUpdate {
        private String novoStatus;

        public void setNovoStatus(String novoStatus) {
            this.novoStatus = novoStatus;
        }
        // *Seria bom adicionar construtores e o toString, mas simplificado aqui.
    }

    @GetMapping("/contagem-mensal")
    public List<Map<String, Object>> getContagemMensalDeContas() {
        return contaService.getMonthlyAccountCreationCounts();
    }
}
