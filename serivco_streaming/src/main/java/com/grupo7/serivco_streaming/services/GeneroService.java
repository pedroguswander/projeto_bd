package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.Genero;
import com.grupo7.serivco_streaming.repositories.GeneroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GeneroService {

    @Autowired
    private GeneroRepository generoRepository;

    public Genero criarGenero(Genero genero) {
        return generoRepository.create(genero);
    }

    public Optional<Genero> buscarGeneroPorId(int id) {
        return generoRepository.findById(id);
    }

    public List<Genero> listarTodosGeneros() {
        return generoRepository.findAll();
    }

    public boolean atualizarGenero(int id, Genero genero) {
        int linhasAfetadas = generoRepository.update(id, genero);
        return linhasAfetadas > 0;
    }

    public boolean deletarGenero(int id) {
        int linhasAfetadas = generoRepository.deleteById(id);
        return linhasAfetadas > 0;
    }
}