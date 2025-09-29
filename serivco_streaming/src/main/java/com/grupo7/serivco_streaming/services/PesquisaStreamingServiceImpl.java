package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.PesquisaStreaming;
import com.grupo7.serivco_streaming.exception.ResourceNotFoundException;
import com.grupo7.serivco_streaming.repositories.PesquisaStreamingRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
}