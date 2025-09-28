// Local: com/grupo7/serivco_streaming/service/ObraServiceImpl.java
package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.Obra;
import com.grupo7.serivco_streaming.exception.ResourceNotFoundException; // Precisamos criar esta exceção
import com.grupo7.serivco_streaming.repositories.ObraRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service // Anotação que define esta classe como um componente de serviço do Spring
public class ObraServiceImpl implements ObraService {

    private final ObraRepository obraRepository;

    public ObraServiceImpl(ObraRepository obraRepository) {
        this.obraRepository = obraRepository;
    }

    @Override
    public Obra create(Obra obra) {
        // Regra de negócio de exemplo: garantir que o nome não seja nulo ou vazio
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
        // Regra de negócio: verificar se a obra existe antes de tentar atualizar
        obraRepository.findById(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Obra não encontrada com o código: " + codigo));

        obra.codigo = codigo;
        obraRepository.update(obra);
        return obra;
    }

    @Override
    public void delete(int codigo) {
        // Regra de negócio: verificar se a obra existe antes de tentar deletar
        if (!obraRepository.existsById(codigo)) {
            throw new ResourceNotFoundException("Obra não encontrada com o código: " + codigo);
        }
        obraRepository.deleteById(codigo);
    }

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
}