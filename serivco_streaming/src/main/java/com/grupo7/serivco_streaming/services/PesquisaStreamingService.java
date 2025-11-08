package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.PesquisaStreaming;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PesquisaStreamingService {
    PesquisaStreaming create(PesquisaStreaming pesquisa);
    List<PesquisaStreaming> findAll();
    Optional<PesquisaStreaming> findById(int id);
    PesquisaStreaming update(int id, PesquisaStreaming pesquisa);
    void delete(int id);

    Map<String, Long> getStreamingHoursCountsByValue();
    Map<String, Double> getMediaSatisfacaoPorGenero();
    Map<String, Map<String, Long>> getGeneroPorAssistido();
	Map<String, Long> getTotalPorGenero();
}
	