//  file entity TestResult.java để quản lý kết quả xét nghiệm, liên kết với Order và User (staff nhập kết quả).

package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String result; // Kết quả xét nghiệm (positive, negative, inconclusive, etc.)
    private String status; // Trạng thái kết quả (pending, approved, delivered)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private User staff;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
    
    // New fields for detailed test results
    @Column(name = "test_date")
    private LocalDateTime testDate; // Ngày thực hiện xét nghiệm
    
    @Column(name = "result_details", columnDefinition = "TEXT")
    private String resultDetails; // Chi tiết kết quả xét nghiệm (JSON format)
    
    @Column(name = "confidence_level")
    private Double confidenceLevel; // Độ tin cậy của kết quả (0-100%)
    
    @Column(name = "test_method")
    private String testMethod; // Phương pháp xét nghiệm
    
    @Column(name = "lab_notes", columnDefinition = "TEXT")
    private String labNotes; // Ghi chú từ phòng lab
    
    @Column(name = "quality_control")
    private String qualityControl; // Thông tin kiểm soát chất lượng
    
    @Column(name = "pdf_url")
    private String pdfUrl; // URL của file PDF kết quả
    
    @Column(name = "is_urgent")
    private Boolean isUrgent; // Đánh dấu xét nghiệm khẩn cấp
    
    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate; // Ngày dự kiến trả kết quả

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public User getStaff() { return staff; }
    public void setStaff(User staff) { this.staff = staff; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }
    
    // New getters and setters
    public LocalDateTime getTestDate() { return testDate; }
    public void setTestDate(LocalDateTime testDate) { this.testDate = testDate; }
    
    public String getResultDetails() { return resultDetails; }
    public void setResultDetails(String resultDetails) { this.resultDetails = resultDetails; }
    
    public Double getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(Double confidenceLevel) { this.confidenceLevel = confidenceLevel; }
    
    public String getTestMethod() { return testMethod; }
    public void setTestMethod(String testMethod) { this.testMethod = testMethod; }
    
    public String getLabNotes() { return labNotes; }
    public void setLabNotes(String labNotes) { this.labNotes = labNotes; }
    
    public String getQualityControl() { return qualityControl; }
    public void setQualityControl(String qualityControl) { this.qualityControl = qualityControl; }
    
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    
    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }
    
    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
} 