package com.example.threatintelligenceportalspring.service;

import com.example.threatintelligenceportalspring.entity.Threat;
import com.example.threatintelligenceportalspring.repository.ThreatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThreatServiceImpl implements ThreatService {

    @Autowired
    private ThreatRepository threatRepository;

    @Override
    public Threat addThreat(Threat threat) {

        if (threatRepository.existsByThreatName(threat.getThreatName())) {
            throw new RuntimeException("Threat already exists.");
        }

        return threatRepository.save(threat);
    }

    @Override
    public List<Threat> getAllThreats() {
        return threatRepository.findAll();
    }

    @Override
    public Threat getThreatById(Integer id) {

        return threatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Threat not found."));
    }

    @Override
    public Threat updateThreat(Integer id, Threat threat) {

        Threat existingThreat = getThreatById(id);

        if (!existingThreat.getThreatName().equalsIgnoreCase(threat.getThreatName())
                && threatRepository.existsByThreatName(threat.getThreatName())) {

            throw new RuntimeException("Threat already exists.");

        }

        existingThreat.setThreatName(threat.getThreatName());
        existingThreat.setCategory(threat.getCategory());
        existingThreat.setSeverity(threat.getSeverity());
        existingThreat.setStatus(threat.getStatus());
        existingThreat.setDescription(threat.getDescription());
        existingThreat.setMitigation(threat.getMitigation());
        existingThreat.setDateReported(threat.getDateReported());

        return threatRepository.save(existingThreat);
    }

    @Override
    public void deleteThreat(Integer id) {

        Threat threat = getThreatById(id);

        threatRepository.delete(threat);

    }

    @Override
    public List<Threat> getThreatsBySeverity(String severity) {

        return threatRepository.findBySeverity(severity);

    }

    @Override
    public List<Threat> getThreatsByStatus(String status) {

        return threatRepository.findByStatus(status);

    }

}