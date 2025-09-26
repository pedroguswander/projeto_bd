package com.grupo7.serivco_streaming.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BasicController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/consulta-obra-like")
    public String consultaObraLike() {
        return "consulta-obra-like";
    }

    @GetMapping("/criar-obra")
    public String criarObra() {
        return "criar-obra";
    }

    @GetMapping("/delete-obra")
    public String deleteObra() {
        return "delete-obra";
    }

    @GetMapping("/update-obra")
    public String updateObra() {
        return "update-obra";
    }
}
