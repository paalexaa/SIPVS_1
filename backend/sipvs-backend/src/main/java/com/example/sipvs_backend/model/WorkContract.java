package com.example.sipvs_backend.model;

import java.util.List;

public class WorkContract {

    private String name;
    private String birthDate;
    private String adresa;
    private String email;
    private String phone;

    private String companyName;
    private String companyAdresa;
    private String contactInfo;

    private String positionTitle;
    private String jobType;
    private String placeOfWork;
    private String startDate;
    private String salary;

    private List<String> duties;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getBirthDate() {
        return birthDate;
    }
    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getAdresa() {
        return adresa;
    }
    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyAdresa() {
        return companyAdresa;
    }
    public void setCompanyAdresa(String companyAdresa) {
        this.companyAdresa = companyAdresa;
    }

    public String getContactInfo() {
        return contactInfo;
    }
    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getPositionTitle() {
        return positionTitle;
    }
    public void setPositionTitle(String positionTitle) {
        this.positionTitle = positionTitle;
    }

    public String getJobType() {
        return jobType;
    }
    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getPlaceOfWork() {
        return placeOfWork;
    }
    public void setPlaceOfWork(String placeOfWork) {
        this.placeOfWork = placeOfWork;
    }

    public String getStartDate() {
        return startDate;
    }
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getSalary() {
        return salary;
    }
    public void setSalary(String salary) {
        this.salary = salary;
    }

    public List<String> getDuties() {
        return duties;
    }
    public void setDuties(List<String> duties) {
        this.duties = duties;
    }
}
