package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.Service;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long>, JpaSpecificationExecutor<Service> {
    
    // Tìm tất cả dịch vụ đang hoạt động
    List<Service> findByIsActiveTrue();
    
    // Tìm dịch vụ theo category
    List<Service> findByCategoryAndIsActiveTrue(String category);
    
    // Tìm dịch vụ theo tên (không phân biệt hoa thường)
    List<Service> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    // Tìm dịch vụ theo khoảng giá
    @Query("SELECT s FROM Service s WHERE s.price BETWEEN :minPrice AND :maxPrice AND s.isActive = true")
    List<Service> findByPriceRangeAndIsActiveTrue(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    // Tìm dịch vụ theo category và khoảng giá
    @Query("SELECT s FROM Service s WHERE s.category = :category AND s.price BETWEEN :minPrice AND :maxPrice AND s.isActive = true")
    List<Service> findByCategoryAndPriceRangeAndIsActiveTrue(
        @Param("category") String category, 
        @Param("minPrice") Double minPrice, 
        @Param("maxPrice") Double maxPrice
    );
    
    // Đếm số dịch vụ theo category
    long countByCategoryAndIsActiveTrue(String category);
    
    // Tìm dịch vụ có giá thấp nhất
    @Query("SELECT s FROM Service s WHERE s.isActive = true ORDER BY s.price ASC")
    List<Service> findCheapestServices();
    
    // Tìm dịch vụ phổ biến (có thể mở rộng sau)
    @Query("SELECT s FROM Service s WHERE s.isActive = true ORDER BY s.createdAt DESC")
    List<Service> findLatestServices();
    
    // Kiểm tra tên dịch vụ đã tồn tại chưa
    boolean existsByNameIgnoreCase(String name);
    
    // Tìm dịch vụ theo ID và đang hoạt động
    Optional<Service> findByIdAndIsActiveTrue(Long id);

    // Dashboard statistics methods
    long countByIsActive(Boolean isActive);
}
