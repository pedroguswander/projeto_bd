package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.PesquisaProcessadaDTO;
import com.grupo7.serivco_streaming.dto.PesquisaRawDTO;
import com.grupo7.serivco_streaming.dto.PesquisaStreaming;
import com.grupo7.serivco_streaming.exception.ResourceNotFoundException;
import com.grupo7.serivco_streaming.repositories.PesquisaStreamingRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PesquisaStreamingServiceImpl implements PesquisaStreamingService {

    private final PesquisaStreamingRepository pesquisaRepository;

    public PesquisaStreamingServiceImpl(PesquisaStreamingRepository pesquisaRepository) {
        this.pesquisaRepository = pesquisaRepository;
    }

    @Override
    public PesquisaStreaming create(PesquisaStreaming pesquisa) {
        if (pesquisa.email != null && pesquisaRepository.existsByEmail(pesquisa.email)) {
            throw new DuplicateKeyException("Este email já respondeu a pesquisa.");
        }
        int id = pesquisaRepository.insert(pesquisa);
        pesquisa.idResposta = id;
        return pesquisa;
    }

    @Override
    public List<PesquisaStreaming> findAll() {
        return pesquisaRepository.findAll();
    }

    @Override
    public Optional<PesquisaStreaming> findById(int id) {
        return pesquisaRepository.findById(id);
    }

    @Override
    public PesquisaStreaming update(int id, PesquisaStreaming pesquisa) {
        pesquisaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pesquisa não encontrada com o id: " + id));

        pesquisa.idResposta = id;
        pesquisaRepository.update(id, pesquisa);
        return pesquisa;
    }

    @Override
    public void delete(int id) {
        if (!pesquisaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pesquisa não encontrada com o id: " + id);
        }
        pesquisaRepository.delete(id);
    }

    @Override
    public Map<String, Double> getMediaSatisfacaoPorGenero() {
        return pesquisaRepository.getMediaSatisfacaoPorGenero();
    }

    @Override
    public Map<String, Long> getStreamingHoursCountsByValue() {
        return pesquisaRepository.getStreamingHoursCountsByValue();
    }

    // NOVO
    @Override
    public Map<String, Map<String, Long>> getGeneroPorAssistido() {
        return pesquisaRepository.getGeneroPorAssistido();
    }

    public List<PesquisaProcessadaDTO> getDadosProcessados() {
        // 1. Busca os dados brutos do banco
        List<PesquisaRawDTO> dadosBrutos = pesquisaRepository.getPrecoIdealEQuantidadeAssinaturas();

        // 2. Mapeia os dados brutos para os dados processados usando os filtros
        return dadosBrutos.stream()
                .map(this::transformarDados)
                .collect(Collectors.toList());
    }

    /**
     * Método auxiliar para transformar um registro DTO bruto em um processado.
     */
    private PesquisaProcessadaDTO transformarDados(PesquisaRawDTO rawDTO) {
        int precoMapeado = mapearPreco(rawDTO.getPrecoIdealMenos());
        int qtdMapeada = mapearQtdAssinaturas(rawDTO.getQtdAssinaturas());

        return new PesquisaProcessadaDTO(precoMapeado, qtdMapeada);
    }

    /**
     * Aplica o filtro solicitado para a coluna 'preco_ideal_menos'.
     */
    private int mapearPreco(String precoIdealStr) {
        if (precoIdealStr == null) {
            return 0; // Valor padrão ou tratamento de erro
        }

        switch (precoIdealStr) {
            case "Até R$15,00":
                return 15;
            case "Entre R$15,00 e R$30,00":
                return 25;
            case "Entre R$30,00 e R$50,00":
                return 40;
            case "Acima de R$50,00":
                return 50;
            default:
                return 0; // Valor padrão caso o texto não corresponda
        }
    }

    /**
     * Aplica o filtro solicitado para a coluna 'qtd_assinaturas'.
     */
    private int mapearQtdAssinaturas(String qtdAssinaturasStr) {
        if (qtdAssinaturasStr == null) {
            return 0; // Valor padrão ou tratamento de erro
        }

        switch (qtdAssinaturasStr) {
            case "0":
                return 0;
            case "1":
                return 1;
            case "2":
                return 2;
            case "3":
                return 3;
            case "4 a 5":
                return 4;
            case "6 ou mais":
                return 6;
            default:
                return 0; // Valor padrão
        }
    }
    public Map<String, Long> getTotalPorGenero() {
        return pesquisaRepository.getTotalPorGenero();
    }
    @Override
    public Map<String, Map<String, Long>> getGeneroPorHorasSemanais() {
        return pesquisaRepository.getGeneroPorHorasSemanais();
    }
    
    @Override
    public Map<String, Map<String, Long>> getDispositivosPorGeneroAssistido() {
        return pesquisaRepository.getDispositivosPorGeneroAssistido();
    }

}
