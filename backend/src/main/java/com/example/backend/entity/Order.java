package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNumber;
    private String customerName;
    private String serviceName;
    private String serviceCategory; // DNA_HOME, DNA_PROFESSIONAL, DNA_FACILITY
    @Column(name = "order_date")
    private LocalDateTime orderDate;
    private Double totalAmount;
    private String orderType; // self_submission, home_collection, in_clinic
    private String status; // Workflow status for different order types
    private String paymentStatus; // pending, paid, refunded, failed
    private String address;
    private String email;
    private String phone;
    private String notes;
    
    // New fields for detailed workflow tracking
    @Column(name = "appointment_date")
    private LocalDateTime appointmentDate; // Ngày hẹn xét nghiệm
    
    @Column(name = "accepted_date")
    private LocalDateTime acceptedDate; // Ngày admin nhận đơn
    
    @Column(name = "kit_sent_date")
    private LocalDateTime kitSentDate; // Ngày gửi kit (cho self_submission)
    
    @Column(name = "sample_collected_date")
    private LocalDateTime sampleCollectedDate; // Ngày thu mẫu
    
    @Column(name = "sample_received_date")
    private LocalDateTime sampleReceivedDate; // Ngày nhận mẫu tại lab
    
    @Column(name = "testing_started_date")
    private LocalDateTime testingStartedDate; // Ngày bắt đầu xét nghiệm
    
    @Column(name = "results_ready_date")
    private LocalDateTime resultsReadyDate; // Ngày có kết quả
    
    @Column(name = "results_delivered_date")
    private LocalDateTime resultsDeliveredDate; // Ngày trả kết quả
    
    @Column(name = "estimated_completion_date")
    private LocalDateTime estimatedCompletionDate; // Ngày dự kiến hoàn thành
    
    @Column(name = "staff_assigned")
    private String staffAssigned; // Nhân viên được phân công
    
    @Column(name = "tracking_number")
    private String trackingNumber; // Mã theo dõi (cho kit/sample)
    
    @Column(name = "sample_notes")
    private String sampleNotes; // Ghi chú về mẫu
    
    @Column(name = "result_notes")
    private String resultNotes; // Ghi chú về kết quả

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getServiceCategory() { return serviceCategory; }
    public void setServiceCategory(String serviceCategory) { this.serviceCategory = serviceCategory; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    // New getters and setters
    public LocalDateTime getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }
    
    public LocalDateTime getAcceptedDate() { return acceptedDate; }
    public void setAcceptedDate(LocalDateTime acceptedDate) { this.acceptedDate = acceptedDate; }
    
    public LocalDateTime getKitSentDate() { return kitSentDate; }
    public void setKitSentDate(LocalDateTime kitSentDate) { this.kitSentDate = kitSentDate; }
    
    public LocalDateTime getSampleCollectedDate() { return sampleCollectedDate; }
    public void setSampleCollectedDate(LocalDateTime sampleCollectedDate) { this.sampleCollectedDate = sampleCollectedDate; }
    
    public LocalDateTime getSampleReceivedDate() { return sampleReceivedDate; }
    public void setSampleReceivedDate(LocalDateTime sampleReceivedDate) { this.sampleReceivedDate = sampleReceivedDate; }
    
    public LocalDateTime getTestingStartedDate() { return testingStartedDate; }
    public void setTestingStartedDate(LocalDateTime testingStartedDate) { this.testingStartedDate = testingStartedDate; }
    
    public LocalDateTime getResultsReadyDate() { return resultsReadyDate; }
    public void setResultsReadyDate(LocalDateTime resultsReadyDate) { this.resultsReadyDate = resultsReadyDate; }
    
    public LocalDateTime getResultsDeliveredDate() { return resultsDeliveredDate; }
    public void setResultsDeliveredDate(LocalDateTime resultsDeliveredDate) { this.resultsDeliveredDate = resultsDeliveredDate; }
    
    public LocalDateTime getEstimatedCompletionDate() { return estimatedCompletionDate; }
    public void setEstimatedCompletionDate(LocalDateTime estimatedCompletionDate) { this.estimatedCompletionDate = estimatedCompletionDate; }
    
    public String getStaffAssigned() { return staffAssigned; }
    public void setStaffAssigned(String staffAssigned) { this.staffAssigned = staffAssigned; }
    
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    
    public String getSampleNotes() { return sampleNotes; }
    public void setSampleNotes(String sampleNotes) { this.sampleNotes = sampleNotes; }
    
    public String getResultNotes() { return resultNotes; }
    public void setResultNotes(String resultNotes) { this.resultNotes = resultNotes; }
}
