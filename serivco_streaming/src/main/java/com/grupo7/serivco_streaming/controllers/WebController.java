package com.grupo7.serivco_streaming.controllers;

import com.grupo7.serivco_streaming.dto.Usuario;
import com.grupo7.serivco_streaming.services.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Controller
public class WebController {

    private final UsuarioService usuarioService;


    public WebController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

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

    @GetMapping("/consulta-obra-join-genero")
    public String consultaObraJoinGenero() {
        return "consulta-obra-join-genero";
    }



    @GetMapping("/web/usuarios/buscar-por-email")
    public String paginaBuscaPorEmail(@RequestParam(required = false) String email, Model model) {
        if (email != null && !email.isEmpty()) {
            Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email);
            if (usuarioOpt.isPresent()) {
                model.addAttribute("usuarioEncontrado", usuarioOpt.get());
            } else {
                model.addAttribute("mensagemErro", "Nenhum usuário encontrado com o e-mail: " + email);
            }
        }
        return "busca-email";
    }

    @GetMapping("/web/usuarios/buscar-por-bairro")
    public String paginaBuscaPorBairro(@RequestParam(required = false) String bairro, Model model) {
        if (bairro != null && !bairro.isEmpty()) {
            List<Usuario> usuarios = usuarioService.findByBairro(bairro);
            model.addAttribute("usuariosEncontrados", usuarios);
            model.addAttribute("bairroPesquisado", bairro);
        }
        return "busca-bairro";
    }
}