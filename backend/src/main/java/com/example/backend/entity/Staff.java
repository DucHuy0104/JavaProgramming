package com.example.backend.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

// Annotation
@Entity
@Table(name = "staff")
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "fullname", nullable = false)
    private String fullName;

    @Column(name = "gmail", nullable = false, unique = true)
    private String gmail;

    @Column(name = "phoneNumber", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "role", nullable = false)
    private String role; //Quản lý, Admin, Giám sát, Nhân viên

    @Column(name ="department", nullable = false)
    private String department;  // Marketing, IT, HR, Sales

    @Column(name ="status")
    private String status;      // Hoạt động, Chờ duyệt

    @Column(name = "hire_date") // Ngày thuê
    private LocalDate hireDate;

    @Column(name = "salary") // Lương 
    private Long salary;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "address")
    private String address;
    
    // Constructors
    public Staff(){

    }
    public Staff(String fullName, String gmail, String phoneNumber, String role, String department, String status, LocalDate hireDate, Long salary, String password, String address) {
        this.fullName = fullName;
        this.gmail = gmail;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.department = department;
        this.status = status;
        this.hireDate = hireDate;
        this.salary = salary;
        this.password = password;
        this.address = address;
}
 public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getGmail() {
        return gmail;
    }

    public void setGmail(String gmail) {
        this.gmail = gmail;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public Long getSalary() {
        return salary;
    }

    public void setSalary(Long salary) {
        this.salary = salary;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
