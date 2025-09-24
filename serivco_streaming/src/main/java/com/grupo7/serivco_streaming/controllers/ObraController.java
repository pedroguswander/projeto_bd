package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Obra;
import com.grupo7.serivco_streaming.repositories.ObraRepository;
import com.grupo7.serivco_streaming.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/obras")
public class ObraController {

    @Autowired
    private ObraRepository obraRepository;

    @PostMapping
    public ResponseEntity<String> createObra(@RequestBody Obra obra) {
        try {
            int result = obraRepository.insert(obra);
            if (result > 0) {
                return new ResponseEntity<>("Obra criada com sucesso.", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("Erro ao criar a obra.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Erro interno do servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<String> updateObra(@PathVariable int codigo, @RequestBody Obra obra) {
        try {
            obra.codigo = codigo; // Garante que o código do path seja usado
            int result = obraRepository.update(obra);
            if (result > 0) {
                return new ResponseEntity<>("Obra atualizada com sucesso.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Obra não encontrada ou erro na atualização.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Erro interno do servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para deletar uma obra (DELETE)
    @DeleteMapping("/{codigo}")
    public ResponseEntity<String> deleteObra(@PathVariable int codigo) {
        try {
            int result = obraRepository.deleteById(codigo);
            if (result > 0) {
                return new ResponseEntity<>("Obra deletada com sucesso.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Obra não encontrada.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Erro interno do servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
