package com.example.backend.service;

import com.example.backend.entity.Blog;
import com.example.backend.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    // Create new blog
    public Blog createBlog(Blog blog) {
        blog.setStatus("DRAFT");
        blog.setViewCount(0L);
        blog.setFeatured(false);
        return blogRepository.save(blog);
    }

    // Get all blogs
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // Get blog by ID
    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    // Get blog by ID and increment view count
    public Optional<Blog> getBlogByIdAndIncrementView(Long id) {
        Optional<Blog> blogOptional = blogRepository.findById(id);
        if (blogOptional.isPresent()) {
            Blog blog = blogOptional.get();
            blog.incrementViewCount();
            blogRepository.save(blog);
        }
        return blogOptional;
    }

    // Get published blogs with pagination
    public Page<Blog> getPublishedBlogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return blogRepository.findByStatus("PUBLISHED", pageable);
    }

    // Get blogs by category
    public Page<Blog> getBlogsByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return blogRepository.findByCategoryAndStatus(category, "PUBLISHED", pageable);
    }

    // Get featured blogs
    public List<Blog> getFeaturedBlogs() {
        return blogRepository.findByFeaturedTrueAndStatus("PUBLISHED");
    }

    // Get recent blogs
    public Page<Blog> getRecentBlogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogRepository.findRecentBlogs("PUBLISHED", pageable);
    }

    // Get top viewed blogs
    public Page<Blog> getTopViewedBlogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogRepository.findTopViewedBlogs("PUBLISHED", pageable);
    }

    // Search blogs by keyword
    public Page<Blog> searchBlogs(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return blogRepository.searchByKeywordAndStatus(keyword, "PUBLISHED", pageable);
    }

    // Get blogs by author
    public Page<Blog> getBlogsByAuthor(String author, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return blogRepository.findByAuthor(author, pageable);
    }

    // Update blog
    public Blog updateBlog(Long id, Blog updatedBlog) {
        Optional<Blog> blogOptional = blogRepository.findById(id);
        if (blogOptional.isEmpty()) {
            throw new RuntimeException("Blog không tồn tại!");
        }

        Blog blog = blogOptional.get();
        blog.setTitle(updatedBlog.getTitle());
        blog.setContent(updatedBlog.getContent());
        blog.setSummary(updatedBlog.getSummary());
        blog.setCategory(updatedBlog.getCategory());
        blog.setTags(updatedBlog.getTags());
        blog.setImageUrl(updatedBlog.getImageUrl());

        return blogRepository.save(blog);
    }

    // Publish blog
    public Blog publishBlog(Long id) {
        Optional<Blog> blogOptional = blogRepository.findById(id);
        if (blogOptional.isEmpty()) {
            throw new RuntimeException("Blog không tồn tại!");
        }

        Blog blog = blogOptional.get();
        blog.setStatus("PUBLISHED");
        blog.setPublishedAt(LocalDateTime.now());
        return blogRepository.save(blog);
    }

    // Unpublish blog
    public Blog unpublishBlog(Long id) {
        Optional<Blog> blogOptional = blogRepository.findById(id);
        if (blogOptional.isEmpty()) {
            throw new RuntimeException("Blog không tồn tại!");
        }

        Blog blog = blogOptional.get();
        blog.setStatus("DRAFT");
        blog.setPublishedAt(null);
        return blogRepository.save(blog);
    }

    // Set featured blog
    public Blog setFeaturedBlog(Long id, boolean featured) {
        Optional<Blog> blogOptional = blogRepository.findById(id);
        if (blogOptional.isEmpty()) {
            throw new RuntimeException("Blog không tồn tại!");
        }

        Blog blog = blogOptional.get();
        blog.setFeatured(featured);
        return blogRepository.save(blog);
    }

    // Delete blog
    public void deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new RuntimeException("Blog không tồn tại!");
        }
        blogRepository.deleteById(id);
    }

    // Get blogs by status
    public List<Blog> getBlogsByStatus(String status) {
        return blogRepository.findByStatus(status);
    }

    // Count blogs by status
    public long countBlogsByStatus(String status) {
        return blogRepository.countByStatus(status);
    }

    // Count blogs by category
    public long countBlogsByCategory(String category) {
        return blogRepository.countByCategory(category);
    }
}
