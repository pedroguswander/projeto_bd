package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.DetalheAvaliacaoDTO;
import com.grupo7.serivco_streaming.repositories.DetalheAvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/detalhe-avaliacoes") // Exemplo de URL base
public class DetalheAvaliacaoController {

    @Autowired
    private DetalheAvaliacaoRepository repository; // Injete seu repositório

    /**
     * Endpoint para buscar detalhes de avaliações.
     * Aceita um parâmetro opcional 'nome_usuario' para filtragem.
     * * Exemplo de uso:
     * GET /api/avaliacoes               (Retorna todos)
     * GET /api/avaliacoes?nome_usuario=joao  (Retorna apenas os de 'joao')
     */
    @GetMapping("/filter")
    public ResponseEntity<List<DetalheAvaliacaoDTO>> GetDetalheAvaliacaoObraUsuarios(
            @RequestParam(name = "nome_usuario", required = false) String nomeUsuario) {

        // Chama o método do repositório, passando o parâmetro (que pode ser nulo)
        List<DetalheAvaliacaoDTO> detalhes = repository.getDetalheAvaliacaoObraUsuarios(nomeUsuario);

        // Retorna a lista (pode ser vazia) com status 200 OK
        return ResponseEntity.ok(detalhes);
    }
}