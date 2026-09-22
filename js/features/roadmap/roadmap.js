document.addEventListener('DOMContentLoaded', () => {
  const FALLBACK_COURSES = [
  {
    "code": "71ITBS10103",
    "id": "71ITBS10103",
    "name": "Nhập môn Công nghệ thông tin",
    "en": "Introduction to Information Technology",
    "credits": 3,
    "section": "Kiến thức cơ sở khối ngành",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITBS10203",
    "id": "71ITBS10203",
    "name": "Cơ sở lập trình",
    "en": "Programming Basics",
    "credits": 3,
    "section": "Kiến thức cơ sở khối ngành",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITIS30103",
    "id": "71ITIS30103",
    "name": "Cơ sở dữ liệu",
    "en": "Databases",
    "credits": 3,
    "section": "Kiến thức cơ sở khối ngành",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITNW30103",
    "id": "71ITNW30103",
    "name": "Nhập môn Mạng máy tính và điện toán đám mây",
    "en": "Introduction to Computer Networks and Cloud Computing",
    "credits": 3,
    "section": "Kiến thức cơ sở khối ngành",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 2,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITSE30303",
    "id": "71ITSE30303",
    "name": "Cấu trúc dữ liệu và giải thuật",
    "en": "Data Structures and Algorithms",
    "credits": 3,
    "section": "Kiến thức cơ sở khối ngành",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 3,
    "prereqCode": "71ITBS10203",
    "prereqName": "Cơ sở lập trình",
    "note": ""
  },
  {
    "code": "71ITMA10404",
    "id": "71ITMA10404",
    "name": "Toán rời rạc",
    "en": "Discrete Mathematics",
    "credits": 4,
    "section": "Kiến thức cơ sở khối ngành",
    "type": "BB",
    "major": "",
    "year": 2,
    "semester": 1,
    "prereqCode": "71ITMA10104",
    "prereqName": "Toán cao cấp và ứng dụng",
    "note": ""
  },
  {
    "code": "71ITSE30103",
    "id": "71ITSE30103",
    "name": "Kỹ thuật lập trình",
    "en": "Programming Techniques",
    "credits": 3,
    "section": "Kiến thức cơ sở khối ngành",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 2,
    "prereqCode": "71ITBS10203",
    "prereqName": "Cơ sở lập trình",
    "note": ""
  },
  {
    "code": "71ITSE30203",
    "id": "71ITSE30203",
    "name": "Lập trình hướng đối tượng",
    "en": "Object-Oriented Programming",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "BB",
    "major": "",
    "year": 2,
    "semester": 1,
    "prereqCode": "71ITBS10203",
    "prereqName": "Cơ sở lập trình",
    "note": ""
  },
  {
    "code": "71ITDS30103",
    "id": "71ITDS30103",
    "name": "Các nền tảng phát triển phần mềm",
    "en": "Software Development Platforms",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "BB",
    "major": "",
    "year": 2,
    "semester": 2,
    "prereqCode": "71ITBS10103",
    "prereqName": "Nhập môn Công nghệ thông tin",
    "note": ""
  },
  {
    "code": "71ITSE30503",
    "id": "71ITSE30503",
    "name": "Lập trình ứng dụng Web",
    "en": "Web Application Programming",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "BB",
    "major": "",
    "year": 2,
    "semester": 1,
    "prereqCode": "71ITBS10203",
    "prereqName": "Cơ sở lập trình",
    "note": ""
  },
  {
    "code": "71ITAI40103",
    "id": "71ITAI40103",
    "name": "Nhập môn Trí tuệ nhân tạo",
    "en": "Introduction to Artificial Intelligence",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "BB",
    "major": "",
    "year": 2,
    "semester": 3,
    "prereqCode": "71ITBS10203",
    "prereqName": "Cơ sở lập trình",
    "note": ""
  },
  {
    "code": "71ITDS30203",
    "id": "71ITDS30203",
    "name": "Nhập môn Phân tích Dữ liệu và Học sâu",
    "en": "Introduction to Data Analytics and Deep Learning",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "TC209",
    "major": "",
    "year": 2,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITDS40203",
    "id": "71ITDS40203",
    "name": "Xác xuất thống kê ứng dụng",
    "en": "Applicable Probability and Statistics",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "TC209",
    "major": "",
    "year": 2,
    "semester": 2,
    "prereqCode": "71ITMA10404",
    "prereqName": "Toán rời rạc",
    "note": ""
  },
  {
    "code": "71ITSE30403",
    "id": "71ITSE30403",
    "name": "Lập trình ứng dụng Java",
    "en": "Java Application Programming",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "TC209",
    "major": "",
    "year": 2,
    "semester": 2,
    "prereqCode": "71ITSE30103",
    "prereqName": "Kỹ thuật lập trình",
    "note": ""
  },
  {
    "code": "71NWSE40103",
    "id": "71NWSE40103",
    "name": "Nhập môn hệ thống nhúng",
    "en": "Foundation of Embedded System",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "TC209",
    "major": "",
    "year": 2,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ISBC30103",
    "id": "71ISBC30103",
    "name": "Nhập môn Hệ thống thông tin",
    "en": "Introduction to Information Systems",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "TC209",
    "major": "",
    "year": 2,
    "semester": 2,
    "prereqCode": "71ITBS10103",
    "prereqName": "Nhập môn Công nghệ thông tin",
    "note": ""
  },
  {
    "code": "71ITNW30303",
    "id": "71ITNW30303",
    "name": "An ninh Mạng máy tính",
    "en": "Network Security",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "TC209",
    "major": "",
    "year": 2,
    "semester": 2,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITIS30303",
    "id": "71ITIS30303",
    "name": "Quản lý Dự án Công nghệ Thông tin",
    "en": "IT Project Management",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "TC209",
    "major": "",
    "year": 2,
    "semester": 2,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITSE30903",
    "id": "71ITSE30903",
    "name": "Thiết kế giao diện người dùng",
    "en": "User Interface Design",
    "credits": 3,
    "section": "Kiến thức cơ sở ngành",
    "type": "TC209",
    "major": "",
    "year": 2,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITSE41003",
    "id": "71ITSE41003",
    "name": "Nhập môn Công nghệ phần mềm",
    "en": "Introduction to Software Technology",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Phần mềm",
    "year": 2,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITSE41103",
    "id": "71ITSE41103",
    "name": "Kỹ thuật lấy yêu cầu",
    "en": "Requirements Engineering",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Phần mềm",
    "year": 3,
    "semester": 1,
    "prereqCode": "71ITSE41003",
    "prereqName": "Nhập môn Công nghệ phần mềm",
    "note": ""
  },
  {
    "code": "71ITSE41203",
    "id": "71ITSE41203",
    "name": "Kiểm thử phần mềm",
    "en": "Software Testing",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Phần mềm",
    "year": 3,
    "semester": 1,
    "prereqCode": "71ITSE41003",
    "prereqName": "Nhập môn Công nghệ phần mềm",
    "note": ""
  },
  {
    "code": "71ITSE41303",
    "id": "71ITSE41303",
    "name": "Phân tích và thiết kế hệ thống theo Hướng đối tượng",
    "en": "Object Oriented Analysis and Design",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Phần mềm",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITSE41103",
    "prereqName": "Kỹ thuật lấy yêu cầu",
    "note": ""
  },
  {
    "code": "71ITSE41403",
    "id": "71ITSE41403",
    "name": "Lập trình Web nâng cao",
    "en": "Advanced Web Programming",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Phần mềm",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITSE30503",
    "prereqName": "Lập trình ứng dụng Web",
    "note": ""
  },
  {
    "code": "71ITSE41503",
    "id": "71ITSE41503",
    "name": "Quản lý dự án phần mềm",
    "en": "Software Project Management",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Phần mềm",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITSE41003",
    "prereqName": "Nhập môn Công nghệ phần mềm",
    "note": ""
  },
  {
    "code": "71ITDS40303",
    "id": "71ITDS40303",
    "name": "Nhập môn Phân tích Dữ liệu lớn",
    "en": "Introduction to BigData Analytics",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Dữ liệu",
    "year": 2,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITAI40203",
    "id": "71ITAI40203",
    "name": "Nhập môn học máy",
    "en": "Introduction to Machine Learning",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Dữ liệu",
    "year": 3,
    "semester": 1,
    "prereqCode": "71ITDS40203",
    "prereqName": "Xác xuất thống kê ứng dụng",
    "note": ""
  },
  {
    "code": "71ITAI40303",
    "id": "71ITAI40303",
    "name": "Các hệ hỗ trợ ra quyết định",
    "en": "Decision Support Systems",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Dữ liệu",
    "year": 3,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITDS40403",
    "id": "71ITDS40403",
    "name": "Số hóa và quản trị thông tin số",
    "en": "Information Digitization and Management",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Dữ liệu",
    "year": 3,
    "semester": 2,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITAI40903",
    "id": "71ITAI40903",
    "name": "Lập trình tính toán song song",
    "en": "Parallel Computational Programming",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Dữ liệu",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITSE30303",
    "prereqName": "Cấu trúc dữ liệu và giải thuật",
    "note": ""
  },
  {
    "code": "71ITDS40503",
    "id": "71ITDS40503",
    "name": "Mã hóa dữ liệu và chuỗi khối (Block chain)",
    "en": "Data Encryption and Security",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Công nghệ Dữ liệu",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITIS30103",
    "prereqName": "Cơ sở dữ liệu",
    "note": ""
  },
  {
    "code": "71ITAI40803",
    "id": "71ITAI40803",
    "name": "Nhập môn xử lý ảnh số",
    "en": "Introduction to Digital Image Processing",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Trí tuệ Nhân tạo",
    "year": 2,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITAI41203",
    "id": "71ITAI41203",
    "name": "Học máy ứng dụng",
    "en": "Applied Machine Learning",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Trí tuệ Nhân tạo",
    "year": 3,
    "semester": 1,
    "prereqCode": "71ITDS40203",
    "prereqName": "Xác xuất thống kê ứng dụng",
    "note": ""
  },
  {
    "code": "71ITAI40503",
    "id": "71ITAI40503",
    "name": "Trí tuệ nhân tạo ứng dụng",
    "en": "Applied Artificial Intelligence",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Trí tuệ Nhân tạo",
    "year": 3,
    "semester": 1,
    "prereqCode": "71ITDS40203",
    "prereqName": "Xác xuất thống kê ứng dụng",
    "note": ""
  },
  {
    "code": "71ITAI40603",
    "id": "71ITAI40603",
    "name": "Thị giác máy tính",
    "en": "Computer Vision",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Trí tuệ Nhân tạo",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITAI41203",
    "prereqName": "Học máy và ứng dụng",
    "note": ""
  },
  {
    "code": "71ITAI40403",
    "id": "71ITAI40403",
    "name": "Giới thiệu về học sâu",
    "en": "Introduction to Deep learning",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Trí tuệ Nhân tạo",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITAI40503",
    "prereqName": "Trí tuệ nhân tạo ứng dụng",
    "note": ""
  },
  {
    "code": "71ITAI41303",
    "id": "71ITAI41303",
    "name": "Các công cụ và nền tảng cho trí tuệ nhân tạo",
    "en": "Tools and Platforms for Artificial Intelligence",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "BB",
    "major": "Trí tuệ Nhân tạo",
    "year": 3,
    "semester": 2,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITIS30203",
    "id": "71ITIS30203",
    "name": "Hệ Quản trị Cơ sở dữ liệu",
    "en": "Database Management System",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "TC309",
    "major": "Tự chọn Chuyên ngành",
    "year": 2,
    "semester": 2,
    "prereqCode": "71ITIS30103",
    "prereqName": "Cơ sở dữ liệu",
    "note": ""
  },
  {
    "code": "71ITSE30603",
    "id": "71ITSE30603",
    "name": "Lập trình ứng dụng di động",
    "en": "Mobile Application Programming",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "TC309",
    "major": "Tự chọn Chuyên ngành",
    "year": 3,
    "semester": 1,
    "prereqCode": "71ITBS10203",
    "prereqName": "Cơ sở lập trình",
    "note": ""
  },
  {
    "code": "71ITSE30703",
    "id": "71ITSE30703",
    "name": "Lập trình di động nâng cao",
    "en": "Advanced Mobile Programming",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "TC309",
    "major": "Tự chọn Chuyên ngành",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITSE30603",
    "prereqName": "Lập trình ứng dụng di động",
    "note": ""
  },
  {
    "code": "71ITSE31003",
    "id": "71ITSE31003",
    "name": "Lập trình Python nâng cao",
    "en": "Advanced Python Programming",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "TC309",
    "major": "Tự chọn Chuyên ngành",
    "year": 3,
    "semester": 2,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITNW30403",
    "id": "71ITNW30403",
    "name": "Lập trình Hệ thống nhúng và Mạng kết nối vạn vật",
    "en": "Programming for Embedded Systems and Internet of Things",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "TC309",
    "major": "Tự chọn Chuyên ngành",
    "year": 3,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITAI51403",
    "id": "71ITAI51403",
    "name": "Nhập môn tối ưu hóa",
    "en": "Introduction to Optimization",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "TC309",
    "major": "Tự chọn Chuyên ngành",
    "year": 3,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITSE30803",
    "id": "71ITSE30803",
    "name": "Lập trình Java nâng cao",
    "en": "Advanced Java Programming",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "TC309",
    "major": "Tự chọn Chuyên ngành",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITSE30403",
    "prereqName": "Lập trình ứng dụng Java",
    "note": ""
  },
  {
    "code": "71ITSE41603",
    "id": "71ITSE41603",
    "name": "Kiểm thử tự động",
    "en": "Automation Testing",
    "credits": 3,
    "section": "Kiến thức chuyên ngành hoặc chuyên sâu",
    "type": "TC309",
    "major": "Tự chọn Chuyên ngành",
    "year": 3,
    "semester": 2,
    "prereqCode": "71ITSE41203",
    "prereqName": "Kiểm thử phần mềm",
    "note": ""
  },
  {
    "code": "71ITIN40304",
    "id": "71ITIN40304",
    "name": "Đồ án thực tập",
    "en": "Internship Project",
    "credits": 4,
    "section": "Học kỳ doanh nghiệp",
    "type": "BB",
    "major": "",
    "year": 3,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": "Theo quy định của Khoa"
  },
  {
    "code": "71ITGR40206",
    "id": "71ITGR40206",
    "name": "Đồ án Tốt nghiệp",
    "en": "Graduation Projects",
    "credits": 6,
    "section": "Khóa luận/đồ án tốt nghiệp; hoặc học phần thay thế KL/ĐA TN",
    "type": "TC406",
    "major": "",
    "year": 4,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": "HP Bắt buộc Chuyên ngành"
  },
  {
    "code": "71ITIS30603",
    "id": "71ITIS30603",
    "name": "Chuyên đề Tối ưu hóa máy tìm kiếm",
    "en": "Search Engine Optimization",
    "credits": 3,
    "section": "Khóa luận/đồ án tốt nghiệp; hoặc học phần thay thế KL/ĐA TN",
    "type": "TC406",
    "major": "Tự chọn Chuyên ngành",
    "year": 4,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITIS30503",
    "id": "71ITIS30503",
    "name": "Chuyên đề Thương Mại điện tử",
    "en": "E-Commerce",
    "credits": 3,
    "section": "Khóa luận/đồ án tốt nghiệp; hoặc học phần thay thế KL/ĐA TN",
    "type": "TC406",
    "major": "Tự chọn Chuyên ngành",
    "year": 4,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71LAWG10012",
    "id": "71LAWG10012",
    "name": "Pháp luật đại cương",
    "en": "General Law",
    "credits": 2,
    "section": "Đại cương",
    "type": "BB",
    "major": "",
    "year": 3,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ENVH10012",
    "id": "71ENVH10012",
    "name": "Môi trường và con người",
    "en": "",
    "credits": 2,
    "section": "Đại cương",
    "type": "BB",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71ITMA10104",
    "id": "71ITMA10104",
    "name": "Toán cao cấp và ứng dụng",
    "en": "Advanced Calculus",
    "credits": 4,
    "section": "Đại cương",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 2,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71MATL10053",
    "id": "71MATL10053",
    "name": "Đại số tuyến tính và ứng dụng",
    "en": "Linear Algebra",
    "credits": 3,
    "section": "Đại cương",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 3,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71SSK110023",
    "id": "71SSK110023",
    "name": "Kỹ năng công dân toàn cầu",
    "en": "",
    "credits": 3,
    "section": "Đại cương",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71POLP10013",
    "id": "71POLP10013",
    "name": "Triết học Mác-Lênin",
    "en": "Philosophy of Marxism and Leninism",
    "credits": 3,
    "section": "Lý luận chính trị",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 2,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71POLE10022",
    "id": "71POLE10022",
    "name": "Kinh tế chính trị Mác-Lênin",
    "en": "Marxist – Leninist Political Economy",
    "credits": 2,
    "section": "Lý luận chính trị",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 3,
    "prereqCode": "71POLP10013",
    "prereqName": "Triết học Mác-Lênin",
    "note": ""
  },
  {
    "code": "71POLS10032",
    "id": "71POLS10032",
    "name": "Chủ nghĩa xã hội khoa học",
    "en": "Scientific Socialism",
    "credits": 2,
    "section": "Lý luận chính trị",
    "type": "BB",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "71POLP10013",
    "prereqName": "Triết học Mác-Lênin",
    "note": ""
  },
  {
    "code": "71POLH10042",
    "id": "71POLH10042",
    "name": "Tư tưởng Hồ Chí Minh",
    "en": "Ho Chi Minh's Thought",
    "credits": 2,
    "section": "Lý luận chính trị",
    "type": "BB",
    "major": "",
    "year": 3,
    "semester": 3,
    "prereqCode": "71POLE10022",
    "prereqName": "Kinh tế chính trị Mác-Lênin, [71POLS10032]Chủ nghĩa xã hội khoa học",
    "note": ""
  },
  {
    "code": "71POLC10052",
    "id": "71POLC10052",
    "name": "Lịch sử Đảng Cộng sản Việt Nam",
    "en": "History of Vietnamese Communist Party",
    "credits": 2,
    "section": "Lý luận chính trị",
    "type": "BB",
    "major": "",
    "year": 3,
    "semester": 3,
    "prereqCode": "71POLE10022",
    "prereqName": "Kinh tế chính trị Mác-Lênin, [71POLS10032]Chủ nghĩa xã hội khoa học",
    "note": ""
  },
  {
    "code": "71ENG110013",
    "id": "71ENG110013",
    "name": "Anh văn 1 (AV1)",
    "en": "English 1",
    "credits": 3,
    "section": "Ngoại ngữ",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 1,
    "prereqCode": "71ENG010012",
    "prereqName": "Anh văn dự bị (AV0)",
    "note": ""
  },
  {
    "code": "71ENG210023",
    "id": "71ENG210023",
    "name": "Anh văn 2 (AV2)",
    "en": "English 2",
    "credits": 3,
    "section": "Ngoại ngữ",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 2,
    "prereqCode": "71ENG110013",
    "prereqName": "Anh văn 1 (AV1)",
    "note": ""
  },
  {
    "code": "71ENG310033",
    "id": "71ENG310033",
    "name": "Anh văn 3 (AV3)",
    "en": "English 3",
    "credits": 3,
    "section": "Ngoại ngữ",
    "type": "BB",
    "major": "",
    "year": 1,
    "semester": 3,
    "prereqCode": "71ENG210023",
    "prereqName": "Anh văn 2 (AV2)",
    "note": ""
  },
  {
    "code": "71ENG410043",
    "id": "71ENG410043",
    "name": "Anh văn 4 (AV4)",
    "en": "English 4",
    "credits": 3,
    "section": "Ngoại ngữ",
    "type": "BB",
    "major": "",
    "year": 2,
    "semester": 1,
    "prereqCode": "71ENG310033",
    "prereqName": "Anh văn 3 (AV3)",
    "note": ""
  },
  {
    "code": "71ENG510053",
    "id": "71ENG510053",
    "name": "Anh văn 5 (AV5)",
    "en": "English 5",
    "credits": 3,
    "section": "Ngoại ngữ",
    "type": "BB",
    "major": "",
    "year": 2,
    "semester": 2,
    "prereqCode": "71ENG410043",
    "prereqName": "Anh văn 4 (AV4)",
    "note": ""
  },
  {
    "code": "71ENG610063",
    "id": "71ENG610063",
    "name": "Anh văn 6 (AV6)",
    "en": "English 6",
    "credits": 3,
    "section": "Ngoại ngữ",
    "type": "BB",
    "major": "",
    "year": 2,
    "semester": 3,
    "prereqCode": "71ENG510053",
    "prereqName": "Anh văn 5 (AV5)",
    "note": ""
  },
  {
    "code": "71ENG710073",
    "id": "71ENG710073",
    "name": "Anh văn 7 (AV7)",
    "en": "English 7",
    "credits": 3,
    "section": "Ngoại ngữ",
    "type": "BB",
    "major": "",
    "year": 3,
    "semester": 1,
    "prereqCode": "71ENG610063",
    "prereqName": "Anh văn 6 (AV6)",
    "note": ""
  },
  {
    "code": "71PEKC10062",
    "id": "71PEKC10062",
    "name": "Cờ vua",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC002 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PESW10042",
    "id": "71PESW10042",
    "name": "Bơi lội",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC002 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEYO10142",
    "id": "71PEYO10142",
    "name": "Hatha yoga",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC002 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEKC10172",
    "id": "71PEKC10172",
    "name": "Cờ vua nâng cao",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "71PEKC10062",
    "prereqName": "Cờ vua",
    "note": ""
  },
  {
    "code": "71PEBA10052",
    "id": "71PEBA10052",
    "name": "Cầu lông",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEBB10032",
    "id": "71PEBB10032",
    "name": "Bóng rổ",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEDA10102",
    "id": "71PEDA10102",
    "name": "Khiêu vũ",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEFI10072",
    "id": "71PEFI10072",
    "name": "Fitness",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEFU10082",
    "id": "71PEFU10082",
    "name": "Futsal",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEGO10092",
    "id": "71PEGO10092",
    "name": "Golf",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEMA10132",
    "id": "71PEMA10132",
    "name": "Võ thuật",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEMT10152",
    "id": "71PEMT10152",
    "name": "Marathon",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PESC10112",
    "id": "71PESC10112",
    "name": "Leo núi thể thao",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PESS10162",
    "id": "71PESS10162",
    "name": "Bắn súng thể thao",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PETE10122",
    "id": "71PETE10122",
    "name": "Tennis",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PETT10012",
    "id": "71PETT10012",
    "name": "Bóng bàn",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71PEVB10022",
    "id": "71PEVB10022",
    "name": "Bóng chuyền",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "TC102 (2TC)",
    "major": "",
    "year": 9,
    "semester": 9,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71NAD110013",
    "id": "71NAD110013",
    "name": "GDQP1: Đường lối QP và AN của ĐCSVN",
    "en": "",
    "credits": 3,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "BBKTL",
    "major": "",
    "year": 1,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71NAD210022",
    "id": "71NAD210022",
    "name": "GDQP2: Công tác quốc phòng và an ninh",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "BBKTL",
    "major": "",
    "year": 1,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71NAD310032",
    "id": "71NAD310032",
    "name": "GDQP3: Quân sự chung",
    "en": "",
    "credits": 2,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "BBKTL",
    "major": "",
    "year": 1,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  },
  {
    "code": "71NAD410044",
    "id": "71NAD410044",
    "name": "GDQP4: Kỹ thuật chiến đấu bộ binh và chiến thuật",
    "en": "",
    "credits": 4,
    "section": "Giáo dục thể chất và giáo dục quốc phòng",
    "type": "BBKTL",
    "major": "",
    "year": 1,
    "semester": 1,
    "prereqCode": "",
    "prereqName": "",
    "note": ""
  }
];

  const COHORTS = {
    k30: { label: 'Khóa 30 - CNTT', targetCredits: 126, urls: ['/VLU-Chatbot/knowledge/khungK30.txt','../../../VLU-Chatbot/knowledge/khungK30.txt','/knowledge/khungK30.txt','../../../knowledge/khungK30.txt'] },
    k29: { label: 'Khóa 29 trở về trước', targetCredits: 126, urls: ['/VLU-Chatbot/knowledge/khungK30.txt','../../../VLU-Chatbot/knowledge/khungK30.txt','/knowledge/khungK30.txt','../../../knowledge/khungK30.txt'] }
  };

  const state = { cohortKey: 'k30', cohortLabel: COHORTS.k30.label, targetCredits: 126, rawKnowledge: '', courses: [], completedIds: new Set() };
  const $ = (id) => document.getElementById(id);
  const cohortSelect = $('cohortSelect');
  const roadmapGrid = $('roadmapGrid');
  const knowledgeContent = $('knowledgeContent');
  const searchInput = $('courseSearchInput');

  cohortSelect?.addEventListener('change', e => loadCohort(e.target.value));
  searchInput?.addEventListener('input', renderRoadmap);
  $('clearCompletedBtn')?.addEventListener('click', () => {
    if (!confirm('Bạn muốn bỏ chọn toàn bộ môn đã học?')) return;
    state.completedIds.clear();
    saveCompletedState();
    renderRoadmap();
    updateProgress();
  });

  async function loadCohort(key = 'k30') {
    const config = COHORTS[key] || COHORTS.k30;
    state.cohortKey = key || 'k30';
    state.cohortLabel = config.label;
    state.targetCredits = config.targetCredits;
    state.rawKnowledge = '';
    state.courses = [];
    state.completedIds = loadCompletedState();
    showLoadingState();

    let loadedText = '';
    for (const url of config.urls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          loadedText = await res.text();
          break;
        }
      } catch (_) {}
    }

    let parsed = loadedText ? parseCoursesFromKnowledge(loadedText) : [];
    if (!parsed.length) {
      parsed = FALLBACK_COURSES.map(c => ({ ...c, id: c.code }));
      loadedText = 'Đang dùng dữ liệu dự phòng được nhúng trong roadmap.js vì không đọc được file khungK30.txt.';
    }

    state.rawKnowledge = loadedText;
    state.courses = normalizeCourses(parsed);
    if (knowledgeContent) knowledgeContent.textContent = loadedText;
    $('targetCredits').textContent = state.targetCredits;
    renderRoadmap();
    updateProgress();
  }

  function normalizeCourses(courses) {
    const seen = new Set();
    return courses
      .filter(c => c && c.code && !seen.has(c.code) && seen.add(c.code))
      .map(c => ({
        id: c.id || c.code,
        code: c.code,
        name: c.name || '',
        en: c.en || '',
        credits: Number(c.credits) || 0,
        section: c.section || 'Khác',
        type: c.type || '',
        major: c.major || '',
        year: Number(c.year) || 9,
        semester: Number(c.semester) || 9,
        prereqCode: c.prereqCode || '',
        prereqName: c.prereqName || '',
        note: c.note || ''
      }))
      .sort(courseSorter);
  }

  function parseCoursesFromKnowledge(text) {
    const courses = [];
    const seen = new Set();
    let section = 'Khác';
    let major = '';

    String(text || '').replace(/\r/g, '').split('\n').forEach(raw => {
      const line = raw.trim();
      if (!line) return;
      if (line.startsWith('## ')) {
        section = line.replace(/^##\s+/, '').trim();
        major = '';
        return;
      }
      if (line.startsWith('### ')) {
        major = line.replace(/^###\s+/, '').trim();
        return;
      }
      if (!line.startsWith('- ')) return;

      const parts = line.slice(2).split('|').map(p => p.trim());
      const code = parts[0] || '';
      const name = parts[1] || '';
      if (!/^[0-9A-Z]{6,}/.test(code) || seen.has(code)) return;

      const c = { id: code, code, name, en: '', credits: 0, section, type: '', major, year: 9, semester: 9, prereqCode: '', prereqName: '', note: '' };
      parts.slice(2).forEach(p => {
        if (/^EN:/i.test(p)) c.en = p.replace(/^EN:\s*/i, '').trim();
        else if (/^TC:/i.test(p)) {
          const m = p.match(/(\d+)/);
          c.credits = m ? parseInt(m[1], 10) : 0;
        } else if (/^Nhóm:/i.test(p)) c.section = p.replace(/^Nhóm:\s*/i, '').trim();
        else if (/^Loại:/i.test(p)) c.type = p.replace(/^Loại:\s*/i, '').trim();
        else if (/^Chuyên ngành:/i.test(p)) c.major = p.replace(/^Chuyên ngành:\s*/i, '').trim();
        else if (/^Gợi ý:/i.test(p)) {
          const m = p.match(/Năm\s*(\d+)\s*-\s*HK\s*(\d+)/i);
          if (m) {
            c.year = parseInt(m[1], 10);
            c.semester = parseInt(m[2], 10);
          }
        } else if (/^(Học trước|Tiên quyết):/i.test(p)) {
          const content = p.split(':').slice(1).join(':').trim();
          const m = content.match(/\[([^\]]+)\]\s*(.*)/);
          if (m) {
            c.prereqCode = m[1].trim();
            c.prereqName = m[2].trim();
          } else c.note = content;
        }
      });
      seen.add(code);
      courses.push(c);
    });
    return courses;
  }

  function courseSorter(a, b) {
    if (a.year !== b.year) return a.year - b.year;
    if (a.semester !== b.semester) return a.semester - b.semester;
    const sa = sectionOrder(a.section);
    const sb = sectionOrder(b.section);
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name, 'vi');
  }

  function sectionOrder(s) {
    s = String(s || '');
    if (s.includes('Đại cương')) return 1;
    if (s.includes('Lý luận')) return 2;
    if (s.includes('Ngoại ngữ')) return 3;
    if (s.includes('Giáo dục')) return 4;
    if (s.includes('cơ sở khối')) return 5;
    if (s.includes('cơ sở ngành')) return 6;
    if (s.includes('chuyên ngành')) return 7;
    if (s.includes('Học kỳ doanh nghiệp')) return 8;
    if (s.includes('tốt nghiệp')) return 9;
    return 99;
  }

  function renderRoadmap() {
    if (!roadmapGrid) return;
    const kw = (searchInput?.value || '').trim().toLowerCase();
    let list = state.courses;
    if (kw) list = list.filter(c => `${c.code} ${c.name} ${c.en} ${c.section} ${c.major}`.toLowerCase().includes(kw));

    if (!list.length) {
      roadmapGrid.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>Không tìm thấy môn phù hợp hoặc chưa có dữ liệu môn học.</p></div>`;
      return;
    }

    const groups = groupCoursesByTerm(list);
    const wrap = document.createElement('div');
    wrap.className = 'semester-grid';
    groups.forEach(group => {
      const card = document.createElement('section');
      card.className = 'semester-card';
      const creditTotal = group.courses.reduce((s, c) => s + c.credits, 0);
      card.innerHTML = `
        <div class="semester-title">
          <span><i class="fas fa-calendar-alt"></i> ${escapeHtml(group.title)}</span>
          <span class="semester-credit-total">${creditTotal} TC</span>
        </div>
        <ul class="course-list">${group.courses.map(courseItemHtml).join('')}</ul>
      `;
      wrap.appendChild(card);
    });

    roadmapGrid.innerHTML = '';
    roadmapGrid.appendChild(wrap);
    roadmapGrid.querySelectorAll('.course-checkbox').forEach(chk => chk.addEventListener('change', onCourseToggle));
  }

  function courseItemHtml(c) {
    const checked = state.completedIds.has(c.id);
    const prereq = c.prereqCode ? `<span class="badge-prereq" title="Môn học trước: ${escapeHtml(c.prereqName || c.prereqCode)}">Cần: ${escapeHtml(c.prereqCode)}</span>` : '';
    const type = c.type ? `<span class="badge-type">${escapeHtml(c.type)}</span>` : '';
    const major = c.major ? `<span class="badge-major">${escapeHtml(c.major)}</span>` : '';
    return `
      <li class="course-item ${checked ? 'completed' : ''}">
        <label class="course-check-row">
          <input class="course-checkbox" type="checkbox" data-course-id="${escapeHtml(c.id)}" ${checked ? 'checked' : ''}>
          <span class="course-main">
            <span class="course-name">${escapeHtml(c.name)}</span>
            <span class="course-meta">
              <span class="badge-code">${escapeHtml(c.code)}</span>
              <span class="badge-credit">${c.credits} TC</span>
              <span class="badge-section">${escapeHtml(shortSectionName(c.section))}</span>
              ${type}${major}${prereq}
            </span>
          </span>
        </label>
      </li>
    `;
  }

  function onCourseToggle(e) {
    const id = e.target.dataset.courseId;
    const course = state.courses.find(c => c.id === id);
    if (e.target.checked && course?.prereqCode && !state.completedIds.has(course.prereqCode)) {
      const ok = confirm(`Môn này có học phần trước là ${course.prereqCode}${course.prereqName ? ' - ' + course.prereqName : ''}.\nBạn vẫn muốn đánh dấu là đã học?`);
      if (!ok) {
        e.target.checked = false;
        return;
      }
    }
    e.target.checked ? state.completedIds.add(id) : state.completedIds.delete(id);
    saveCompletedState();
    renderRoadmap();
    updateProgress();
  }

  function groupCoursesByTerm(courses) {
    const map = new Map();
    courses.forEach(c => {
      const key = c.year === 9 || c.semester === 9 ? '99-99' : `${String(c.year).padStart(2, '0')}-${String(c.semester).padStart(2, '0')}`;
      const title = key === '99-99' ? 'Môn chưa xác định học kỳ' : `Năm ${c.year} - Học kỳ ${c.semester}`;
      if (!map.has(key)) map.set(key, { title, courses: [] });
      map.get(key).courses.push(c);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }

  function updateProgress() {
    const completed = getCompletedCourses();
    const completedCredits = completed.reduce((s, c) => s + c.credits, 0);
    const remainingCredits = Math.max(state.targetCredits - completedCredits, 0);
    const percent = state.targetCredits ? Math.min(Math.round(completedCredits / state.targetCredits * 100), 100) : 0;
    $('creditCount').textContent = completedCredits;
    $('targetCredits').textContent = state.targetCredits;
    $('remainingCredits').textContent = remainingCredits;
    $('percentText').textContent = percent + '%';
    $('progressBar').style.width = percent + '%';
    const remaining = getRemainingCourses();
    const next = getNextSuggestedCourses(5);
    $('progressNote').innerHTML = `Đã chọn <strong>${completed.length}</strong> môn. Còn <strong>${remaining.length}</strong> môn chưa tích trong dữ liệu. ${next.length ? `Gợi ý tiếp theo: <strong>${escapeHtml(next.map(c => c.name).join(', '))}</strong>.` : 'Bạn đã tích gần hết danh sách môn trong dữ liệu.'}`;
    updateMiniStatus();
  }

  function updateMiniStatus() {
    const completedCredits = getCompletedCourses().reduce((s, c) => s + c.credits, 0);
    const remainingCredits = Math.max(state.targetCredits - completedCredits, 0);
    $('miniStatusCard').innerHTML = `<strong>${escapeHtml(state.cohortLabel)}</strong><br>Đã tích lũy: <strong>${completedCredits}/${state.targetCredits} TC</strong><br>Còn thiếu: <strong>${remainingCredits} TC</strong>`;
  }

  function getCompletedCourses() { return state.courses.filter(c => state.completedIds.has(c.id)); }
  function getRemainingCourses() { return state.courses.filter(c => !state.completedIds.has(c.id)); }
  function getNextSuggestedCourses(limit = 6) {
    return getRemainingCourses()
      .filter(c => !c.prereqCode || state.completedIds.has(c.prereqCode))
      .sort(courseSorter)
      .slice(0, limit);
  }
  function loadCompletedState() {
    try { return new Set(JSON.parse(localStorage.getItem(storageKey()) || '[]')); }
    catch (_) { return new Set(); }
  }
  function saveCompletedState() { localStorage.setItem(storageKey(), JSON.stringify([...state.completedIds])); }
  function storageKey() { return 'vlu-roadmap-completed-' + (state.cohortKey || 'k30'); }

  function showLoadingState() {
    roadmapGrid.innerHTML = `<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Đang tải danh sách môn học...</p></div>`;
  }
  function shortSectionName(section) {
    const s = String(section || 'Khác');
    if (s.includes('cơ sở khối')) return 'Cơ sở khối ngành';
    if (s.includes('cơ sở ngành')) return 'Cơ sở ngành';
    if (s.includes('chuyên ngành')) return 'Chuyên ngành';
    if (s.includes('Ngoại ngữ')) return 'Ngoại ngữ';
    if (s.includes('Giáo dục')) return 'GDTC/QP';
    if (s.includes('Lý luận')) return 'Lý luận CT';
    if (s.includes('Đại cương')) return 'Đại cương';
    if (s.includes('doanh nghiệp')) return 'Thực tập';
    if (s.includes('tốt nghiệp')) return 'Tốt nghiệp';
    return s.length > 24 ? s.slice(0, 24) + '...' : s;
  }

  function setupMiniBot() {
    const send = $('miniSendBtn'), input = $('miniInput');
    const run = () => {
      const text = input.value.trim();
      if (!text) return;
      appendUserMessage(text);
      input.value = '';
      appendBotMessage(buildLocalReply(text));
    };
    send?.addEventListener('click', run);
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  }
  function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'user-msg';
    div.innerHTML = `<div class="content">${escapeHtml(text)}</div>`;
    $('miniMessages').appendChild(div);
    scrollChat();
  }
  function appendBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'bot-msg';
    div.innerHTML = `<div class="content">${formatBotText(text)}</div>`;
    $('miniMessages').appendChild(div);
    scrollChat();
  }
  function scrollChat() { const box = $('miniChatbox'); if (box) box.scrollTop = box.scrollHeight; }
  function buildLocalReply(promptText) {
    const prompt = promptText.toLowerCase();
    const completed = getCompletedCourses();
    const completedCredits = completed.reduce((s, c) => s + c.credits, 0);
    const remainingCredits = Math.max(state.targetCredits - completedCredits, 0);
    const found = findCourseInPrompt(promptText);
    if (found) return `**${found.name}**\n- Mã môn: **${found.code}**\n- Tín chỉ: **${found.credits} TC**\n- Nhóm: **${shortSectionName(found.section)}**\n- Gợi ý: **${found.year === 9 ? 'Chưa rõ học kỳ' : `Năm ${found.year} - HK ${found.semester}`}**\n${found.prereqCode ? `- Môn học trước: **${found.prereqCode} - ${found.prereqName}**` : '- Môn học trước: Không ghi nhận.'}`;
    if (/bao nhiêu|tín chỉ|tc|còn thiếu|đã học|tích lũy|tiến trình/.test(prompt)) return `**Tiến trình hiện tại:**\n- Đã tích lũy: **${completedCredits}/${state.targetCredits} tín chỉ**.\n- Còn thiếu: **${remainingCredits} tín chỉ**.\n- Số môn đã tích: **${completed.length} môn**.`;
    if (/học tiếp|môn nào|nên học|lộ trình|kế hoạch|học kỳ|đăng ký/.test(prompt)) {
      const next = getNextSuggestedCourses(8);
      if (!next.length) return 'Bạn đã tích gần hết danh sách môn trong dữ liệu. Hãy kiểm tra thêm điều kiện tốt nghiệp, ngoại ngữ và các môn tự chọn.';
      return `**Nên ưu tiên học tiếp:**\n${next.map((c, i) => `${i + 1}. **${c.name}** (${c.code}) - ${c.credits} TC${c.prereqCode ? `, cần ${c.prereqCode}` : ''}`).join('\n')}`;
    }
    return `Mình đang dùng dữ liệu **${state.cohortLabel}**. Bạn có thể hỏi: **còn thiếu bao nhiêu tín chỉ**, **nên học môn nào tiếp**, hoặc nhập tên/mã môn để xem thông tin.`;
  }
  function findCourseInPrompt(text) {
    const p = text.toLowerCase();
    return state.courses.find(c => p.includes(c.code.toLowerCase()) || p.includes(c.name.toLowerCase()));
  }
  function formatBotText(text) {
    return escapeHtml(String(text || ''))
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
  function escapeHtml(text) {
    return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  setupMiniBot();
  loadCohort('k30');
});
