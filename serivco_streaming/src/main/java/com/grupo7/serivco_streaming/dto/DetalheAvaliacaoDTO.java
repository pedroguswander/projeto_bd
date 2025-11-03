package com.grupo7.serivco_streaming.dto;

// Você pode usar um Record para um DTO simples
public record DetalheAvaliacaoDTO(
        String nome_usuario,
        String titulo_obra,
        String nome_genero,
        Double nota,
        String data_avaliacao,
        String comentario_avaliacao
        // Adicione aqui todos os outros campos da sua view
) {}
