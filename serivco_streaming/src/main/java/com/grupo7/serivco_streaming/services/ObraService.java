
package com.grupo7.serivco_streaming.services;

import com.grupo7.serivco_streaming.dto.Obra;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ObraService {

    Obra create(Obra obra);

    List<Obra> findAll();

    Optional<Obra> findById(int codigo);

    Obra update(int codigo, Obra obra);

    void delete(int codigo);

    List<String> findByGenero(String nome);

    List<Obra> findByNomeContaining(String nome);

    List<Obra> findByDataLancamento(LocalDate data);

    public List<String> getUsuariosSemPlano();

    public Map<String, Object> obterMetricasVisualizacao(int codigoObra);
}