package com.grupo7.serivco_streaming.controller;

import com.grupo7.serivco_streaming.repositorio.AvaliacaoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import java.sql.SQLException;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HelloWorldController {

    private AvaliacaoRepositorio avaliacaoRepositorio;

    @Autowired
    public HelloWorldController(AvaliacaoRepositorio avaliacaoRepositorio) {
        this.avaliacaoRepositorio = avaliacaoRepositorio;
    }

    @GetMapping("/")
    public List<Map<String, Object>> getExmaple() {
        return avaliacaoRepositorio.getAvaliacaoComNota9();
    }
}
