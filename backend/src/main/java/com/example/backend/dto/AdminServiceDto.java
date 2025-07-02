package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;

public class AdminServiceDto {
    
    private Long id;
    
    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String name;
    
    private String description;
    
    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private Double price;
    
    private String category;
    
    private List<String> features;
    
    private Integer durationDays;
    
    private Boolean isActive;
    
    private String imageUrl;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Thêm các trường cho admin
    private String status; // "ACTIVE", "INACTIVE", "DRAFT"
    
    private String formattedPrice; // Giá đã format (VD: "2,500,000 VND")
    
    private String categoryName; // Tên category dễ đọc
    
    private int totalOrders; // Số lượng đơn hàng (có thể thêm sau)
    
    // Constructors
    public AdminServiceDto() {}
    
    public AdminServiceDto(ServiceDto serviceDto) {
        this.id = serviceDto.getId();
        this.name = serviceDto.getName();
        this.description = serviceDto.getDescription();
        this.price = serviceDto.getPrice();
        this.category = serviceDto.getCategory();
        this.features = serviceDto.getFeatures();
        this.durationDays = serviceDto.getDurationDays();
        this.isActive = serviceDto.getIsActive();
        this.imageUrl = serviceDto.getImageUrl();
        this.createdAt = serviceDto.getCreatedAt();
        this.updatedAt = serviceDto.getUpdatedAt();
        
        // Set additional admin fields
        this.status = (serviceDto.getIsActive() != null && serviceDto.getIsActive()) ? "ACTIVE" : "INACTIVE";
        this.formattedPrice = formatPrice(serviceDto.getPrice());
        this.categoryName = formatCategoryName(serviceDto.getCategory());
        this.totalOrders = 0; // Default value
    }
    
    // Helper methods
    private String formatPrice(Double price) {
        if (price == null) return "0 VND";
        return String.format("%,.0f VND", price);
    }
    
    private String formatCategoryName(String category) {
        if (category == null) return "";
        switch (category) {
            case "DNA_HOME":
                return "Tự lấy mẫu tại nhà";
            case "DNA_PROFESSIONAL":
                return "Nhân viên thu mẫu tại nhà";
            case "DNA_FACILITY":
                return "Thử mẫu tại cơ sở";
            default:
                return category;
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
        this.formattedPrice = formatPrice(price);
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
        this.categoryName = formatCategoryName(category);
    }
    
    public List<String> getFeatures() {
        return features;
    }
    
    public void setFeatures(List<String> features) {
        this.features = features;
    }
    
    public Integer getDurationDays() {
        return durationDays;
    }
    
    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
        this.status = (isActive != null && isActive) ? "ACTIVE" : "INACTIVE";
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getFormattedPrice() {
        return formattedPrice;
    }
    
    public void setFormattedPrice(String formattedPrice) {
        this.formattedPrice = formattedPrice;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    public int getTotalOrders() {
        return totalOrders;
    }
    
    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }
}
