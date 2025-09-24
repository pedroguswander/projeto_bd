package com.grupo7.serivco_streaming.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@RestController
public class ChartDataController {

    @GetMapping("/api/chart-data")
    public Map<String, Object> getChartData() {
        Map<String, Object> data = new HashMap<>();
        data.put("labels", new String[]{"Janeiro", "Fevereiro", "Março", "Abril", "Maio"});
        data.put("values", new int[]{12, 19, 3, 5, 2});
        return data;
    }
}