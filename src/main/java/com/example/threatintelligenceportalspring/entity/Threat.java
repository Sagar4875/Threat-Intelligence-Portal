package com.example.threatintelligenceportalspring.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "threats")
public class Threat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer threatId;

    @Column(nullable = false)
    private String threatName;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String severity;

    @Column(nullable = false)
    private String status;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String mitigation;

    private LocalDate dateReported;

    public Threat() {
    }

    public Integer getThreatId() {
        return threatId;
    }

    public void setThreatId(Integer threatId) {
        this.threatId = threatId;
    }

    public String getThreatName() {
        return threatName;
    }

    public void setThreatName(String threatName) {
        this.threatName = threatName;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMitigation() {
        return mitigation;
    }

    public void setMitigation(String mitigation) {
        this.mitigation = mitigation;
    }

    public LocalDate getDateReported() {
        return dateReported;
    }

    public void setDateReported(LocalDate dateReported) {
        this.dateReported = dateReported;
    }
}