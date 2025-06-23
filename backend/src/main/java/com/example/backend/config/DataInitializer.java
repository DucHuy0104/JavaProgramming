package com.example.backend.config;

import com.example.backend.entity.Blog;
import com.example.backend.entity.User;
import com.example.backend.repository.BlogRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample data if database is empty
        initializeUsers();
        initializeBlogs();
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@dnatesting.com");
            admin.setPhoneNumber("0123456789");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            admin.setAddress("Hà Nội, Việt Nam");
            admin.setGender("Male");
            admin.setDateOfBirth("1990-01-01");
            userRepository.save(admin);

            // Create sample customer
            User customer = new User();
            customer.setFullName("Nguyễn Văn A");
            customer.setEmail("customer@example.com");
            customer.setPhoneNumber("0987654321");
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setRole("CUSTOMER");
            customer.setStatus("ACTIVE");
            customer.setAddress("TP.HCM, Việt Nam");
            customer.setGender("Male");
            customer.setDateOfBirth("1995-05-15");
            userRepository.save(customer);

            System.out.println("✅ Sample users created successfully!");
        }
    }

    private void initializeBlogs() {
        if (blogRepository.count() == 0) {
            // Create sample blogs
            createBlog(
                "Xét nghiệm ADN là gì? Tại sao nó quan trọng?",
                "Xét nghiệm ADN (DNA) là một phương pháp phân tích di truyền hiện đại...",
                "Xét nghiệm ADN là công nghệ tiên tiến giúp xác định thông tin di truyền của con người. Phương pháp này có thể được sử dụng để xác định quan hệ huyết thống, phát hiện bệnh di truyền, và nhiều ứng dụng khác trong y học hiện đại. Quá trình xét nghiệm ADN bao gồm việc lấy mẫu (thường là nước bọt hoặc máu), phân tích trong phòng thí nghiệm chuyên dụng, và đưa ra kết quả chính xác với độ tin cậy cao.",
                "Kiến thức cơ bản",
                "ADN, xét nghiệm, di truyền, y học",
                "Dr. Nguyễn Văn B",
                "https://example.com/images/dna-test-1.jpg"
            );

            createBlog(
                "Quy trình xét nghiệm ADN tại phòng khám",
                "Tìm hiểu chi tiết về quy trình xét nghiệm ADN từ A đến Z...",
                "Quy trình xét nghiệm ADN tại phòng khám bao gồm các bước: 1) Tư vấn và đăng ký, 2) Lấy mẫu bệnh phẩm, 3) Bảo quản và vận chuyển mẫu, 4) Phân tích trong phòng thí nghiệm, 5) Kiểm tra chất lượng kết quả, 6) Trả kết quả và tư vấn. Mỗi bước đều được thực hiện theo tiêu chuẩn quốc tế nghiêm ngặt để đảm bảo độ chính xác cao nhất.",
                "Quy trình",
                "quy trình, xét nghiệm, phòng khám",
                "Dr. Trần Thị C",
                "https://example.com/images/dna-process.jpg"
            );

            createBlog(
                "Ứng dụng của xét nghiệm ADN trong y học",
                "Khám phá những ứng dụng đa dạng của công nghệ xét nghiệm ADN...",
                "Xét nghiệm ADN có nhiều ứng dụng quan trọng trong y học: 1) Chẩn đoán bệnh di truyền, 2) Xác định nguy cơ mắc bệnh, 3) Điều trị cá nhân hóa, 4) Xét nghiệm tiền hôn nhân, 5) Sàng lọc trước sinh, 6) Y học pháp lý. Công nghệ này đang ngày càng phát triển và mở ra nhiều cơ hội mới trong việc chăm sóc sức khỏe con người.",
                "Ứng dụng",
                "ứng dụng, y học, chẩn đoán",
                "Dr. Lê Văn D",
                "https://example.com/images/dna-applications.jpg"
            );

            createBlog(
                "Chuẩn bị gì trước khi xét nghiệm ADN?",
                "Hướng dẫn chuẩn bị chu đáo trước khi thực hiện xét nghiệm ADN...",
                "Để có kết quả xét nghiệm ADN chính xác nhất, bạn cần chuẩn bị: 1) Giấy tờ tùy thân hợp lệ, 2) Không ăn uống 2 giờ trước khi lấy mẫu nước bọt, 3) Không hút thuốc, nhai kẹo cao su trước xét nghiệm, 4) Thông báo các thuốc đang sử dụng, 5) Chuẩn bị tinh thần thoải mái. Việc chuẩn bị tốt sẽ giúp quá trình lấy mẫu diễn ra thuận lợi và kết quả chính xác hơn.",
                "Hướng dẫn",
                "chuẩn bị, hướng dẫn, lưu ý",
                "Dr. Phạm Thị E",
                "https://example.com/images/preparation.jpg"
            );

            System.out.println("✅ Sample blogs created successfully!");
        }
    }

    private void createBlog(String title, String summary, String content, String category, 
                           String tags, String author, String imageUrl) {
        Blog blog = new Blog();
        blog.setTitle(title);
        blog.setSummary(summary);
        blog.setContent(content);
        blog.setCategory(category);
        blog.setTags(tags);
        blog.setAuthor(author);
        blog.setImageUrl(imageUrl);
        blog.setStatus("PUBLISHED");
        blog.setFeatured(false);
        blog.setViewCount(0L);
        blog.setPublishedAt(LocalDateTime.now());
        blogRepository.save(blog);
    }
}
