package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.Obra;
import com.grupo7.serivco_streaming.exception.ResourceNotFoundException; // Precisamos criar esta exceção
import com.grupo7.serivco_streaming.repositories.ObraRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ObraServiceImpl implements ObraService {

    private final ObraRepository obraRepository;

    public ObraServiceImpl(ObraRepository obraRepository) {
        this.obraRepository = obraRepository;
    }

    @Override
    public Obra create(Obra obra) {
        if (obra.nome == null || obra.nome.isBlank()) {
            throw new IllegalArgumentException("O nome da obra não pode ser vazio.");
        }
        int generatedId = obraRepository.insert(obra);
        obra.codigo = generatedId;
        return obra;
    }

    @Override
    public List<Obra> findAll() {
        return obraRepository.findAll();
    }

    @Override
    public Optional<Obra> findById(int codigo) {
        return obraRepository.findById(codigo);
    }

    @Override
    public Obra update(int codigo, Obra obra) {
        obraRepository.findById(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Obra não encontrada com o código: " + codigo));

        obra.codigo = codigo;
        obraRepository.update(obra);
        return obra;
    }

    @Override
    public void delete(int codigo) {
        if (!obraRepository.existsById(codigo)) {
            throw new ResourceNotFoundException("Obra não encontrada com o código: " + codigo);
        }
        obraRepository.deleteById(codigo);
    }

    @Override
    public Optional<Obra> findByName(String nome) { return obraRepository.findByName(nome); }

    @Override
    public List<String> getUsuariosSemPlano() { return obraRepository.getUsuariosSemPlano();};

    @Override
    public List<String> findByGenero(String nome) {
        return obraRepository.findByGenero(nome);
    }

    @Override
    public List<Obra> findByNomeContaining(String nome) {
        return obraRepository.findByNomeContaining(nome);
    }

    @Override
    public List<Obra> findByDataLancamento(LocalDate data) {
        return obraRepository.findByDataLancamento(data);
    }

    @Override
    public Map<String, Object> obterMetricasVisualizacao(int codigoObra) { return obraRepository.obterMetricasVisualizacao(codigoObra); }
}