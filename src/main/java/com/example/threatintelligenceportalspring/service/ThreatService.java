package com.example.threatintelligenceportalspring.service;

import com.example.threatintelligenceportalspring.entity.Threat;

import java.util.List;

public interface ThreatService {

    Threat addThreat(Threat threat);

    List<Threat> getAllThreats();

    Threat getThreatById(Integer id);

    Threat updateThreat(Integer id, Threat threat);

    void deleteThreat(Integer id);

    List<Threat> getThreatsBySeverity(String severity);

    List<Threat> getThreatsByStatus(String status);

}