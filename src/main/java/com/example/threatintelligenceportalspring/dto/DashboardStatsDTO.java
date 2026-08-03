package com.example.threatintelligenceportalspring.dto;

public class DashboardStatsDTO {

    private long totalUsers;
    private long totalCategories;
    private long totalThreats;
    private long criticalThreats;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalUsers,
                             long totalCategories,
                             long totalThreats,
                             long criticalThreats) {

        this.totalUsers = totalUsers;
        this.totalCategories = totalCategories;
        this.totalThreats = totalThreats;
        this.criticalThreats = criticalThreats;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getTotalThreats() {
        return totalThreats;
    }

    public void setTotalThreats(long totalThreats) {
        this.totalThreats = totalThreats;
    }

    public long getCriticalThreats() {
        return criticalThreats;
    }

    public void setCriticalThreats(long criticalThreats) {
        this.criticalThreats = criticalThreats;
    }

}