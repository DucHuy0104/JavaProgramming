package com.example.backend.service;

import com.example.backend.dto.ServiceDto;
import com.example.backend.entity.Service;
import com.example.backend.repository.ServiceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.*;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Lấy tất cả dịch vụ đang hoạt động
    public List<ServiceDto> getAllActiveServices() {
        List<Service> services = serviceRepository.findByIsActiveTrue();
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Lấy dịch vụ theo category
    public List<ServiceDto> getServicesByCategory(String category) {
        List<Service> services = serviceRepository.findByCategoryAndIsActiveTrue(category);
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Tìm kiếm dịch vụ theo tên
    public List<ServiceDto> searchServicesByName(String name) {
        List<Service> services = serviceRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name);
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Lấy dịch vụ theo khoảng giá
    public List<ServiceDto> getServicesByPriceRange(Double minPrice, Double maxPrice) {
        List<Service> services = serviceRepository.findByPriceRangeAndIsActiveTrue(minPrice, maxPrice);
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Lấy dịch vụ theo ID
    public Optional<ServiceDto> getServiceById(Long id) {
        Optional<Service> service = serviceRepository.findByIdAndIsActiveTrue(id);
        return service.map(this::convertToDto);
    }
    
    // Tạo dịch vụ mới (Admin only)
    public ServiceDto createService(ServiceDto serviceDto) {
        // Kiểm tra tên dịch vụ đã tồn tại chưa
        if (serviceRepository.existsByNameIgnoreCase(serviceDto.getName())) {
            throw new RuntimeException("Tên dịch vụ đã tồn tại");
        }
        
        Service service = convertToEntity(serviceDto);
        Service savedService = serviceRepository.save(service);
        return convertToDto(savedService);
    }
    
    // Cập nhật dịch vụ (Admin only)
    public ServiceDto updateService(Long id, ServiceDto serviceDto) {
        Service existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + id));
        
        // Kiểm tra tên dịch vụ đã tồn tại chưa (trừ chính nó)
        if (!existingService.getName().equalsIgnoreCase(serviceDto.getName()) && 
            serviceRepository.existsByNameIgnoreCase(serviceDto.getName())) {
            throw new RuntimeException("Tên dịch vụ đã tồn tại");
        }
        
        // Cập nhật thông tin
        existingService.setName(serviceDto.getName());
        existingService.setDescription(serviceDto.getDescription());
        existingService.setPrice(serviceDto.getPrice());
        existingService.setCategory(serviceDto.getCategory());
        existingService.setDurationDays(serviceDto.getDurationDays());
        existingService.setImageUrl(serviceDto.getImageUrl());

        // Chỉ cập nhật isActive nếu có giá trị, nếu không giữ nguyên
        if (serviceDto.getIsActive() != null) {
            existingService.setIsActive(serviceDto.getIsActive());
        }
        
        // Chuyển đổi features list thành JSON string
        if (serviceDto.getFeatures() != null) {
            try {
                existingService.setFeatures(objectMapper.writeValueAsString(serviceDto.getFeatures()));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Lỗi khi xử lý danh sách tính năng");
            }
        }
        
        Service updatedService = serviceRepository.save(existingService);
        return convertToDto(updatedService);
    }
    
    // Xóa dịch vụ (soft delete - Admin only)
    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + id));

        service.setIsActive(false);
        serviceRepository.save(service);
    }

    // Xóa dịch vụ vĩnh viễn (hard delete - Admin only)
    public void hardDeleteService(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với ID: " + id));

        serviceRepository.delete(service);
    }
    
    // Lấy thống kê dịch vụ
    public long getServiceCountByCategory(String category) {
        return serviceRepository.countByCategoryAndIsActiveTrue(category);
    }
    
    // Lấy dịch vụ mới nhất
    public List<ServiceDto> getLatestServices(int limit) {
        List<Service> services = serviceRepository.findLatestServices();
        return services.stream()
                .limit(limit)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Lấy 3 dịch vụ chính cho trang chủ (1 từ mỗi category)
    public List<ServiceDto> getHomepageServices() {
        List<ServiceDto> homepageServices = new ArrayList<>();

        // Lấy 1 dịch vụ từ mỗi category
        String[] categories = {"DNA_HOME", "DNA_PROFESSIONAL", "DNA_FACILITY"};

        for (String category : categories) {
            List<Service> services = serviceRepository.findByCategoryAndIsActiveTrue(category);
            if (!services.isEmpty()) {
                // Lấy dịch vụ đầu tiên (có thể sắp xếp theo giá hoặc popularity)
                homepageServices.add(convertToDto(services.get(0)));
            }
        }

        return homepageServices;
    }

    // Lấy tất cả dịch vụ cho admin với phân trang và filter
    public Map<String, Object> getAllServicesForAdmin(int page, int size, String sortBy, String sortDir,
                                                      String search, String category, Boolean isActive) {
        // Tạo Sort object
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                   Sort.by(sortBy).descending() :
                   Sort.by(sortBy).ascending();

        // Tạo Pageable
        Pageable pageable = PageRequest.of(page, size, sort);

        // Tạo Specification cho filter
        Specification<Service> spec = Specification.where(null);

        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")),
                                   "%" + search.toLowerCase() + "%"));
        }

        if (category != null && !category.trim().isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category"), category));
        }

        if (isActive != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isActive"), isActive));
        }

        // Thực hiện query
        Page<Service> servicePage = serviceRepository.findAll(spec, pageable);

        // Convert to DTO
        List<ServiceDto> services = servicePage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        // Tạo response
        Map<String, Object> response = new HashMap<>();
        response.put("data", services);
        response.put("currentPage", page);
        response.put("totalPages", servicePage.getTotalPages());
        response.put("totalElements", servicePage.getTotalElements());
        response.put("size", size);
        response.put("hasNext", servicePage.hasNext());
        response.put("hasPrevious", servicePage.hasPrevious());

        return response;
    }

    // Bulk delete services (Admin only)
    public int bulkDeleteServices(List<Long> serviceIds) {
        int deletedCount = 0;
        for (Long id : serviceIds) {
            try {
                Service service = serviceRepository.findById(id).orElse(null);
                if (service != null) {
                    service.setIsActive(false);
                    serviceRepository.save(service);
                    deletedCount++;
                }
            } catch (Exception e) {
                // Log error but continue with other services
                System.err.println("Error deleting service with ID " + id + ": " + e.getMessage());
            }
        }
        return deletedCount;
    }

    // Bulk update service status (Admin only)
    public int bulkUpdateServiceStatus(List<Long> serviceIds, Boolean isActive) {
        int updatedCount = 0;
        for (Long id : serviceIds) {
            try {
                Service service = serviceRepository.findById(id).orElse(null);
                if (service != null) {
                    service.setIsActive(isActive);
                    serviceRepository.save(service);
                    updatedCount++;
                }
            } catch (Exception e) {
                // Log error but continue with other services
                System.err.println("Error updating service with ID " + id + ": " + e.getMessage());
            }
        }
        return updatedCount;
    }

    // Convert Entity to DTO
    private ServiceDto convertToDto(Service service) {
        ServiceDto dto = new ServiceDto();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setCategory(service.getCategory());
        dto.setDurationDays(service.getDurationDays());
        dto.setIsActive(service.getIsActive());
        dto.setImageUrl(service.getImageUrl());
        dto.setCreatedAt(service.getCreatedAt());
        dto.setUpdatedAt(service.getUpdatedAt());
        
        // Chuyển đổi JSON string thành List
        if (service.getFeatures() != null && !service.getFeatures().isEmpty()) {
            try {
                List<String> features = objectMapper.readValue(service.getFeatures(), new TypeReference<List<String>>() {});
                dto.setFeatures(features);
            } catch (JsonProcessingException e) {
                // Nếu không parse được, để null
                dto.setFeatures(null);
            }
        }
        
        return dto;
    }
    
    // Convert DTO to Entity
    private Service convertToEntity(ServiceDto dto) {
        Service service = new Service();
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());
        service.setCategory(dto.getCategory());
        service.setDurationDays(dto.getDurationDays());
        service.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        service.setImageUrl(dto.getImageUrl());
        
        // Chuyển đổi features list thành JSON string
        if (dto.getFeatures() != null) {
            try {
                service.setFeatures(objectMapper.writeValueAsString(dto.getFeatures()));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Lỗi khi xử lý danh sách tính năng");
            }
        }
        
        return service;
    }
}
