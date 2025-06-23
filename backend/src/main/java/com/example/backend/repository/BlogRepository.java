package com.example.backend.repository;

import com.example.backend.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    // Find blogs by status
    List<Blog> findByStatus(String status);
    
    // Find blogs by status with pagination
    Page<Blog> findByStatus(String status, Pageable pageable);
    
    // Find blogs by category
    List<Blog> findByCategory(String category);
    
    // Find blogs by category with pagination
    Page<Blog> findByCategory(String category, Pageable pageable);
    
    // Find blogs by author
    List<Blog> findByAuthor(String author);
    
    // Find blogs by author with pagination
    Page<Blog> findByAuthor(String author, Pageable pageable);
    
    // Find featured blogs
    List<Blog> findByFeaturedTrueAndStatus(String status);
    
    // Search blogs by title (case insensitive)
    @Query("SELECT b FROM Blog b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) AND b.status = :status")
    List<Blog> findByTitleContainingIgnoreCaseAndStatus(@Param("title") String title, @Param("status") String status);
    
    // Search blogs by title or content (case insensitive)
    @Query("SELECT b FROM Blog b WHERE (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND b.status = :status")
    Page<Blog> searchByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") String status, Pageable pageable);
    
    // Find blogs by category and status
    Page<Blog> findByCategoryAndStatus(String category, String status, Pageable pageable);
    
    // Find top viewed blogs
    @Query("SELECT b FROM Blog b WHERE b.status = :status ORDER BY b.viewCount DESC")
    Page<Blog> findTopViewedBlogs(@Param("status") String status, Pageable pageable);
    
    // Find recent blogs
    @Query("SELECT b FROM Blog b WHERE b.status = :status ORDER BY b.createdAt DESC")
    Page<Blog> findRecentBlogs(@Param("status") String status, Pageable pageable);
    
    // Count blogs by status
    long countByStatus(String status);
    
    // Count blogs by category
    long countByCategory(String category);
    
    // Count blogs by author
    long countByAuthor(String author);
}
