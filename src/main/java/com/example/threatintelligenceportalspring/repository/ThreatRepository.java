package com.example.threatintelligenceportalspring.repository;

import com.example.threatintelligenceportalspring.entity.Threat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreatRepository extends JpaRepository<Threat, Integer> {

    boolean existsByThreatName(String threatName);

    List<Threat> findBySeverity(String severity);

    List<Threat> findByStatus(String status);

}