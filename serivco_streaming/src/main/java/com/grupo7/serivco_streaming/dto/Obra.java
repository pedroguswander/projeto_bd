package com.grupo7.serivco_streaming.dto;

import javax.naming.InterruptedNamingException;
import java.time.LocalDate;

import java.sql.Time;
import java.time.LocalDate;

public class Obra {
    public Integer codigo;
    public Integer fkGeneroGeneroPK;
    public String nome;
    public String sinopse;
    public LocalDate dataLancamento;
    public Integer qntTemporadas;
    public Time duracao;
    public Integer  obraTIPO;
}
