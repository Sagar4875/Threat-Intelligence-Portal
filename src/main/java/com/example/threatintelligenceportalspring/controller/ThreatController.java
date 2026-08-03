package com.example.threatintelligenceportalspring.controller;

import com.example.threatintelligenceportalspring.entity.Threat;
import com.example.threatintelligenceportalspring.service.ThreatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threats")
@CrossOrigin(origins = "*")
public class ThreatController {

    @Autowired
    private ThreatService threatService;

    @PostMapping
    public Threat addThreat(@RequestBody Threat threat) {

        return threatService.addThreat(threat);

    }

    @GetMapping
    public List<Threat> getAllThreats() {

        return threatService.getAllThreats();

    }

    @GetMapping("/{id}")
    public Threat getThreatById(@PathVariable Integer id) {

        return threatService.getThreatById(id);

    }

    @PutMapping("/{id}")
    public Threat updateThreat(@PathVariable Integer id,
                               @RequestBody Threat threat) {

        return threatService.updateThreat(id, threat);

    }

    @DeleteMapping("/{id}")
    public void deleteThreat(@PathVariable Integer id) {

        threatService.deleteThreat(id);

    }

    @GetMapping("/severity/{severity}")
    public List<Threat> getThreatsBySeverity(@PathVariable String severity) {

        return threatService.getThreatsBySeverity(severity);

    }

    @GetMapping("/status/{status}")
    public List<Threat> getThreatsByStatus(@PathVariable String status) {

        return threatService.getThreatsByStatus(status);

    }

}