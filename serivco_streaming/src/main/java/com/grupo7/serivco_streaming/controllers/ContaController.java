package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Conta; // Importe o modelo
import com.grupo7.serivco_streaming.services.ContaService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder; // Para o 'created'

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contas")
public class ContaController {

    private final ContaService contaService;

    @Autowired
    public ContaController(ContaService contaService) {
        this.contaService = contaService;
    }

    // ### MÉTODOS EXISTENTES ###

    /**
     * Endpoint HTTP PUT para atualizar o status da conta de um usuário.
     * Exemplo: PUT /api/contas/usuario/10/status
     */
    @PutMapping("/usuario/{usuarioId}/status")
    public ResponseEntity<Void> atualizarStatusConta(
            @PathVariable int usuarioId,
            @RequestBody StatusUpdate request) {

        try {
            contaService.atualizarStatus(usuarioId, request.getNovoStatus());
            // 204 No Content (Sucesso, sem corpo)
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            // 400 Bad Request (Ex: status inválido)
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            // 500 Internal Server Error (Outros erros)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint GET para listar detalhes (Join de conta e usuário).
     * Exemplo: GET /api/contas/detalhes-usuario-conta
     */
    @GetMapping("/detalhes-usuario-conta")
    public ResponseEntity<List<Map<String, Object>>> listarDetalhesContas() {
        List<Map<String, Object>> resultados = contaService.buscarDetalhesContas();
        return ResponseEntity.ok(resultados);
    }


    // ### NOVOS ENDPOINTS CRUD ###

    /**
     * CREATE (POST)
     * Endpoint: POST /api/contas
     * Cria uma nova conta.
     */
    @PostMapping
    public ResponseEntity<Conta> criarConta(@RequestBody Conta conta) {
        Conta novaConta = contaService.criarConta(conta);

        // Retorna 201 Created com a localização (URL) da nova conta no header
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(novaConta.getCodigo())
                .toUri();

        return ResponseEntity.created(location).body(novaConta);
    }

    /**
     * READ (GET All)
     * Endpoint: GET /api/contas
     * Lista todas as contas.
     */
    @GetMapping
    public ResponseEntity<List<Conta>> listarContas() {
        List<Conta> contas = contaService.listarTodasContas();
        return ResponseEntity.ok(contas);
    }

    /**
     * READ (GET by ID)
     * Endpoint: GET /api/contas/{id}
     * Busca uma conta específica.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Conta> buscarContaPorId(@PathVariable int id) {
        Optional<Conta> conta = contaService.buscarContaPorId(id);

        // Retorna 200 OK se encontrar, ou 404 Not Found se não encontrar
        return conta.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * UPDATE (PUT)
     * Endpoint: PUT /api/contas/{id}
     * Atualiza uma conta existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Conta> atualizarConta(@PathVariable int id, @RequestBody Conta conta) {
        boolean atualizado = contaService.atualizarConta(id, conta);

        if (atualizado) {
            // Retorna 200 OK com o objeto atualizado
            return ResponseEntity.ok(conta);
        } else {
            // Se 'atualizarConta' retornar false, a conta não foi encontrada
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE (DELETE)
     * Endpoint: DELETE /api/contas/{id}
     * Deleta uma conta.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConta(@PathVariable int id) {
        boolean deletado = contaService.deletarConta(id);

        if (deletado) {
            // Retorna 204 No Content se foi bem-sucedido
            return ResponseEntity.noContent().build();
        } else {
            // Retorna 404 Not Found se a conta não existia
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/contagem-mensal")
    public List<Map<String, Object>> getContagemMensalDeContas() {
        return contaService.getMonthlyAccountCreationCounts();
    }


    // Classe auxiliar existente
    @Getter
    @Setter
    public static class StatusUpdate {
        private String novoStatus;
    }
}