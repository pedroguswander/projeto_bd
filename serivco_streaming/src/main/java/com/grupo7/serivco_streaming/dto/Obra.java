package com.grupo7.serivco_streaming.dto;

import java.sql.Time;
import java.time.LocalDate;

public class Obra {
    public int codigo;
    public int fkGeneroGeneroPK;
    public String nome;
    public String sinopse;
    public LocalDate dataLancamento;
    public Integer qntTemporadas;
    public Time duracao;
    public int obraTIPO;
}