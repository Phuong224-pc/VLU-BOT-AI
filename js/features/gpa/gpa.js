/**
 * FILE: js/features/gpa/gpa.js
 * Trang Kết quả học tập có sẵn ô nhập MSSV.
 * Khi có dữ liệu thật của 5 sinh viên, chỉ cần thêm vào STUDENT_DATABASE bên dưới.
 */

(() => {
    const TOTAL_PROGRAM_CREDITS = 126;

    /**
     * SAU NÀY THÊM DỮ LIỆU 5 SINH VIÊN Ở ĐÂY.
     * Mẫu cấu trúc:
     *
     * "2474802010419": {
     *   mssv: "2474802010419",
     *   name: "Phan Thanh Tú",
     *   cohort: "K30",
     *   major: "Công nghệ thông tin",
     *   className: "K30 CNTT",
     *   source: "Dữ liệu demo",
     *   courses: [
     *     { code: "71ITBS10203", name: "Cơ sở lập trình", credits: 3, score: 8.0, semester: "HK1 2024-2025", area: "Cơ sở khối ngành" },
     *     { code: "71ITMA10404", name: "Toán rời rạc", credits: 4, score: 4.5, semester: "HK2 2024-2025", area: "Cơ sở khối ngành" }
     *   ]
     * }
     */
    const STUDENT_DATABASE = {
        "2474802010414": {
            mssv: "2474802010414",
            name: "Võ Thành Trung",
            cohort: "K30",
            major: "Công nghệ thông tin",
            className: "K30 CNTT",
            source: "Bảng điểm sinh viên cung cấp - cập nhật 2025-2026 HK02",
            officialCumulativeGpa4: 3.09,
            officialCumulativeCredits: 72,
            officialRating: "Khá",
            courses: [
                // 2024-2025 HK01
                { code: "71ENG01000", name: "Kiểm tra tiếng Anh đầu khóa", credits: 0, score: 5.0, point4: 2.00, letter: "D", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71ENG11013", name: "Anh văn 1 (AV1)", credits: 3, score: 8.0, point4: 3.20, letter: "B+", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITBS10103", name: "Nhập môn công nghệ thông tin", credits: 3, score: 7.8, point4: 3.12, letter: "B", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITBS10203", name: "Cơ sở lập trình", credits: 3, score: 8.6, point4: 3.44, letter: "A", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71SSK11023", name: "Kỹ năng công dân toàn cầu", credits: 3, score: 8.5, point4: 3.40, letter: "A", semester: "2024-2025 HK01", area: "Kỹ năng", status: "Đạt" },

                // 2024-2025 HK02
                { code: "71ENG21023", name: "Anh văn 2 (AV2)", credits: 3, score: 7.0, point4: 2.80, letter: "B", semester: "2024-2025 HK02", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10104", name: "Toán cao cấp và ứng dụng", credits: 4, score: 6.9, point4: 2.76, letter: "C+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITNW30103", name: "Nhập môn mạng máy tính và điện toán đám mây", credits: 3, score: 8.3, point4: 3.32, letter: "B+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITSE30103", name: "Kỹ thuật lập trình", credits: 3, score: 9.9, point4: 3.96, letter: "A+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71PEBA1052", name: "Cầu lông", credits: 2, score: 10.0, point4: 4.00, letter: "A+", semester: "2024-2025 HK02", area: "Giáo dục thể chất", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLP1013", name: "Triết học Mác-Lênin", credits: 3, score: 6.9, point4: 2.76, letter: "C+", semester: "2024-2025 HK02", area: "Lý luận chính trị", status: "Đạt" },

                // 2024-2025 HK03
                { code: "71ENG31033", name: "Anh văn 3 (AV3)", credits: 3, score: 5.7, point4: 2.28, letter: "C", semester: "2024-2025 HK03", area: "Ngoại ngữ", status: "Đạt thấp" },
                { code: "71ITIS30103", name: "Cơ sở dữ liệu", credits: 3, score: 7.5, point4: 3.00, letter: "B", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30303", name: "Cấu trúc dữ liệu và giải thuật", credits: 3, score: 8.9, point4: 3.56, letter: "A", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71MATL10053", name: "Đại số tuyến tính và ứng dụng", credits: 3, score: 8.0, point4: 3.20, letter: "B+", semester: "2024-2025 HK03", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71NAD11013", name: "GDQP1: Đường lối QP và AN của ĐCSVN", credits: 3, score: 8.7, point4: 3.48, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD21022", name: "GDQP2: Công tác quốc phòng và an ninh", credits: 2, score: 8.8, point4: 3.52, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD31032", name: "GDQP3: Quân sự chung", credits: 2, score: 8.5, point4: 3.40, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD41044", name: "GDQP4: Kỹ thuật chiến đấu bộ binh và chiến thuật", credits: 4, score: 8.7, point4: 3.48, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLE1022", name: "Kinh tế chính trị Mác-Lênin", credits: 2, score: 6.3, point4: 2.52, letter: "C", semester: "2024-2025 HK03", area: "Lý luận chính trị", status: "Đạt thấp" },

                // 2025-2026 HK01
                { code: "71ENG41043", name: "Anh văn 4 (AV4)", credits: 3, score: 8.0, point4: 3.20, letter: "B+", semester: "2025-2026 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10403", name: "Toán rời rạc", credits: 4, score: 8.8, point4: 3.52, letter: "A", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30203", name: "Lập trình hướng đối tượng", credits: 3, score: 6.9, point4: 2.76, letter: "C+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30503", name: "Lập trình ứng dụng web", credits: 3, score: 9.2, point4: 3.68, letter: "A+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30603", name: "Lập trình ứng dụng di động", credits: 3, score: 7.8, point4: 3.12, letter: "B", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },

                // 2025-2026 HK02
                { code: "71ENG51053", name: "Anh văn 5 (AV5)", credits: 3, score: 6.7, point4: 2.68, letter: "C+", semester: "2025-2026 HK02", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITDS30103", name: "Các nền tảng phát triển phần mềm", credits: 3, score: 7.5, point4: 3.00, letter: "B", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITIS30303", name: "Quản lý dự án công nghệ thông tin", credits: 3, score: 8.2, point4: 3.28, letter: "B+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30403", name: "Lập trình ứng dụng Java", credits: 3, score: 6.7, point4: 2.68, letter: "C+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71POLS10032", name: "Chủ nghĩa xã hội khoa học", credits: 2, score: 6.3, point4: 2.52, letter: "C", semester: "2025-2026 HK02", area: "Lý luận chính trị", status: "Đạt thấp" }
            ]
        },
        "2474802010118": {
            mssv: "2474802010118",
            name: "Huỳnh Nhựt Hoà",
            cohort: "K30",
            major: "Công nghệ thông tin",
            className: "K30 CNTT",
            source: "Bảng điểm sinh viên cung cấp - cập nhật 2025-2026 HK02",
            officialCumulativeGpa4: 2.70,
            officialCumulativeCredits: 74,
            officialRating: "Khá",
            courses: [
                // Điểm bảo lưu
                { code: "71ENG01012", name: "Anh văn dự bị (AV0)", credits: 2, score: null, point4: null, letter: "MT", semester: "Điểm bảo lưu", area: "Ngoại ngữ", status: "Miễn/ bảo lưu", countCredit: false, countGpa: false },

                // 2024-2025 HK01
                { code: "71ENG01000", name: "Kiểm tra tiếng Anh đầu khóa", credits: 0, score: 5.0, point4: 2.00, letter: "D", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71ENG11013", name: "Anh văn 1 (AV1)", credits: 3, score: 7.4, point4: 2.96, letter: "B", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITBS10103", name: "Nhập môn công nghệ thông tin", credits: 3, score: 6.6, point4: 2.64, letter: "C+", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITBS10203", name: "Cơ sở lập trình", credits: 3, score: 5.8, point4: 2.32, letter: "C", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt thấp" },
                { code: "71SSK11023", name: "Kỹ năng công dân toàn cầu", credits: 3, score: 8.1, point4: 3.24, letter: "B+", semester: "2024-2025 HK01", area: "Kỹ năng", status: "Đạt" },

                // 2024-2025 HK02
                { code: "71ENG21023", name: "Anh văn 2 (AV2)", credits: 3, score: 5.5, point4: 2.20, letter: "C", semester: "2024-2025 HK02", area: "Ngoại ngữ", status: "Đạt thấp" },
                { code: "71ITMA10104", name: "Toán cao cấp và ứng dụng", credits: 4, score: 6.4, point4: 2.56, letter: "C", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt thấp" },
                { code: "71ITNW30103", name: "Nhập môn mạng máy tính và điện toán đám mây", credits: 3, score: 6.1, point4: 2.44, letter: "C", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt thấp" },
                { code: "71ITSE30103", name: "Kỹ thuật lập trình", credits: 3, score: 8.1, point4: 3.24, letter: "B+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71PEBA1052", name: "Cầu lông", credits: 2, score: 7.1, point4: 2.84, letter: "B", semester: "2024-2025 HK02", area: "Giáo dục thể chất", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLP1013", name: "Triết học Mác-Lênin", credits: 3, score: 5.3, point4: 2.12, letter: "D", semester: "2024-2025 HK02", area: "Lý luận chính trị", status: "Đạt thấp" },

                // 2024-2025 HK03
                { code: "71ENG31003", name: "Anh văn 3 (AV3)", credits: 3, score: 6.7, point4: 2.68, letter: "C+", semester: "2024-2025 HK03", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITIS30103", name: "Cơ sở dữ liệu", credits: 3, score: 5.9, point4: 2.36, letter: "C", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt thấp" },
                { code: "71ITSE30303", name: "Cấu trúc dữ liệu và giải thuật", credits: 3, score: 6.3, point4: 2.52, letter: "C", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt thấp" },
                { code: "71MATL10053", name: "Đại số tuyến tính và ứng dụng", credits: 3, score: 5.6, point4: 2.24, letter: "C", semester: "2024-2025 HK03", area: "Cơ sở khối ngành", status: "Đạt thấp" },
                { code: "71NAD11013", name: "GDQP1: Đường lối QP và AN của ĐCSVN", credits: 3, score: 8.1, point4: 3.24, letter: "B+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD21002", name: "GDQP2: Công tác quốc phòng và an ninh", credits: 2, score: 8.1, point4: 3.24, letter: "B+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD31003", name: "GDQP3: Quân sự chung", credits: 2, score: 8.0, point4: 3.20, letter: "B+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD41004", name: "GDQP4: Kỹ thuật chiến đấu bộ binh và chiến thuật", credits: 4, score: 7.0, point4: 2.80, letter: "B", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLE1002", name: "Kinh tế chính trị Mác-Lênin", credits: 2, score: 4.7, point4: 1.88, letter: "F", semester: "2024-2025 HK03", area: "Lý luận chính trị", status: "Không đạt" },

                // 2025-2026 HK01
                { code: "71ENG41003", name: "Anh văn 4 (AV4)", credits: 3, score: 6.5, point4: 2.60, letter: "C+", semester: "2025-2026 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10403", name: "Toán rời rạc", credits: 4, score: 8.1, point4: 3.24, letter: "B+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30203", name: "Lập trình hướng đối tượng", credits: 3, score: 7.1, point4: 2.84, letter: "B", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30503", name: "Lập trình ứng dụng web", credits: 3, score: 8.4, point4: 3.36, letter: "B+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30603", name: "Lập trình ứng dụng di động", credits: 3, score: 5.6, point4: 2.24, letter: "C", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt thấp" },

                // 2025-2026 HK02
                { code: "71ENG51003", name: "Anh văn 5 (AV5)", credits: 3, score: 6.3, point4: 2.52, letter: "C", semester: "2025-2026 HK02", area: "Ngoại ngữ", status: "Đạt thấp" },
                { code: "71ENVH10012", name: "Môi trường và con người", credits: 2, score: 8.8, point4: 3.52, letter: "A", semester: "2025-2026 HK02", area: "Đại cương", status: "Đạt" },
                { code: "71ITDS30103", name: "Các nền tảng phát triển phần mềm", credits: 3, score: 8.0, point4: 3.20, letter: "B+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITNW30303", name: "An ninh mạng máy tính", credits: 3, score: 6.5, point4: 2.60, letter: "C+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30403", name: "Lập trình ứng dụng Java", credits: 3, score: 6.6, point4: 2.64, letter: "C+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71LAWG10012", name: "Pháp luật đại cương", credits: 2, score: 6.6, point4: 2.64, letter: "C+", semester: "2025-2026 HK02", area: "Đại cương", status: "Đạt" },
                { code: "71POLS10032", name: "Chủ nghĩa xã hội khoa học", credits: 2, score: 6.7, point4: 2.68, letter: "C+", semester: "2025-2026 HK02", area: "Lý luận chính trị", status: "Đạt" }
            ]

        },
        "2474802010419": {
            mssv: "2474802010419",
            name: "Phan Thanh Tú",
            cohort: "K30",
            major: "Công nghệ thông tin",
            className: "K30 CNTT",
            source: "Bảng điểm sinh viên cung cấp - cập nhật 2025-2026 HK03",
            officialCumulativeGpa4: 3.39,
            officialCumulativeCredits: 65,
            officialRating: "Giỏi",
            courses: [
                // Điểm bảo lưu
                { code: "71ENG01012", name: "Anh văn dự bị (AV0)", credits: 2, score: null, point4: null, letter: "MT", semester: "Điểm bảo lưu", area: "Ngoại ngữ", status: "Miễn/ bảo lưu", countCredit: false, countGpa: false },

                // 2024-2025 HK01
                { code: "71ENG01000", name: "Kiểm tra tiếng Anh đầu khóa", credits: 0, score: 5.0, point4: 2.00, letter: "D", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71ENG11013", name: "Anh văn 1 (AV1)", credits: 3, score: 7.2, point4: 2.88, letter: "B", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITBS10103", name: "Nhập môn công nghệ thông tin", credits: 3, score: 8.2, point4: 3.28, letter: "B+", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITBS10203", name: "Cơ sở lập trình", credits: 3, score: 8.4, point4: 3.36, letter: "B+", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71SSK11023", name: "Kỹ năng công dân toàn cầu", credits: 3, score: 9.3, point4: 3.72, letter: "A+", semester: "2024-2025 HK01", area: "Kỹ năng", status: "Đạt" },

                // 2024-2025 HK02
                { code: "71ENG21023", name: "Anh văn 2 (AV2)", credits: 3, score: 7.2, point4: 2.88, letter: "B", semester: "2024-2025 HK02", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10104", name: "Toán cao cấp và ứng dụng", credits: 4, score: 8.1, point4: 3.24, letter: "B+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITNW30103", name: "Nhập môn mạng máy tính và điện toán đám mây", credits: 3, score: 9.4, point4: 3.76, letter: "A+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITSE30103", name: "Kỹ thuật lập trình", credits: 3, score: 9.5, point4: 3.80, letter: "A+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71PESW10042", name: "Bơi lội", credits: 2, score: 9.6, point4: 3.84, letter: "A+", semester: "2024-2025 HK02", area: "Giáo dục thể chất", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLP10013", name: "Triết học Mác-Lênin", credits: 3, score: 6.6, point4: 2.64, letter: "C+", semester: "2024-2025 HK02", area: "Lý luận chính trị", status: "Đạt" },

                // 2024-2025 HK03
                { code: "71ENG31033", name: "Anh văn 3 (AV3)", credits: 3, score: 6.7, point4: 2.68, letter: "C+", semester: "2024-2025 HK03", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITIS30103", name: "Cơ sở dữ liệu", credits: 3, score: 6.8, point4: 2.72, letter: "C+", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30303", name: "Cấu trúc dữ liệu và giải thuật", credits: 3, score: 9.3, point4: 3.72, letter: "A+", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71MATL10053", name: "Đại số tuyến tính và ứng dụng", credits: 3, score: 9.0, point4: 3.60, letter: "A+", semester: "2024-2025 HK03", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71NAD11013", name: "GDQP1: Đường lối QP và AN của ĐCSVN", credits: 3, score: 8.4, point4: 3.36, letter: "B+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD21002", name: "GDQP2: Công tác quốc phòng và an ninh", credits: 2, score: 8.9, point4: 3.56, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD31003", name: "GDQP3: Quân sự chung", credits: 2, score: 8.6, point4: 3.44, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD41004", name: "GDQP4: Kỹ thuật chiến đấu bộ binh và chiến thuật", credits: 4, score: 8.3, point4: 3.32, letter: "B+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLE10022", name: "Kinh tế chính trị Mác-Lênin", credits: 2, score: 7.3, point4: 2.92, letter: "B", semester: "2024-2025 HK03", area: "Lý luận chính trị", status: "Đạt" },

                // 2025-2026 HK01
                { code: "71ENG41043", name: "Anh văn 4 (AV4)", credits: 3, score: 7.9, point4: 3.16, letter: "B", semester: "2025-2026 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10403", name: "Toán rời rạc", credits: 4, score: 10.0, point4: 4.00, letter: "A+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30203", name: "Lập trình hướng đối tượng", credits: 3, score: 8.2, point4: 3.28, letter: "B+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30503", name: "Lập trình ứng dụng web", credits: 3, score: 8.8, point4: 3.52, letter: "A", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },

                // 2025-2026 HK02
                { code: "71ITDS30103", name: "Các nền tảng phát triển phần mềm", credits: 3, score: 9.4, point4: 3.76, letter: "A+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITDS40203", name: "Xác suất thống kê ứng dụng", credits: 3, score: 9.7, point4: 3.88, letter: "A+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71LAWG10012", name: "Pháp luật đại cương", credits: 2, score: 9.6, point4: 3.84, letter: "A+", semester: "2025-2026 HK02", area: "Đại cương", status: "Đạt" },
                { code: "71PEBB10032", name: "Bóng rổ", credits: 2, score: 10.0, point4: 4.00, letter: "A+", semester: "2025-2026 HK02", area: "Giáo dục thể chất", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLS10032", name: "Chủ nghĩa xã hội khoa học", credits: 2, score: 9.7, point4: 3.88, letter: "A+", semester: "2025-2026 HK02", area: "Lý luận chính trị", status: "Đạt" },

                // 2025-2026 HK03 - đang học/chưa có điểm
                { code: "71ITAI40103", name: "Nhập môn trí tuệ nhân tạo", credits: 3, score: null, point4: null, letter: "", semester: "2025-2026 HK03", area: "Cơ sở ngành", status: "Đang học", countCredit: false, countGpa: false }
            ]
        }
        ,"2474802010071": {
            mssv: "2474802010071",
            name: "Võ Ngọc Duy",
            cohort: "K30",
            major: "Công nghệ thông tin",
            className: "K30 CNTT",
            source: "Bảng điểm sinh viên cung cấp - cập nhật 2025-2026 HK02",
            officialCumulativeGpa4: 3.25,
            officialCumulativeCredits: 69,
            officialRating: "Giỏi",
            courses: [
                // 2024-2025 HK01
                { code: "71ENG01000", name: "Kiểm tra tiếng Anh đầu khóa", credits: 0, score: 5.0, point4: 2.00, letter: "D", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71ENG01012", name: "Anh văn dự bị (AV0)", credits: 2, score: 9.5, point4: 3.80, letter: "A+", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt / không tính TC", countCredit: false, countGpa: false },
                { code: "71ITBS10103", name: "Nhập môn công nghệ thông tin", credits: 3, score: 7.8, point4: 3.12, letter: "B", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITBS10203", name: "Cơ sở lập trình", credits: 3, score: 5.8, point4: 2.32, letter: "C", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt thấp" },
                { code: "71SSK11023", name: "Kỹ năng công dân toàn cầu", credits: 3, score: 8.4, point4: 3.36, letter: "B+", semester: "2024-2025 HK01", area: "Kỹ năng", status: "Đạt" },

                // 2024-2025 HK02
                { code: "71ENG11013", name: "Anh văn 1 (AV1)", credits: 3, score: 7.6, point4: 3.04, letter: "B", semester: "2024-2025 HK02", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10104", name: "Toán cao cấp và ứng dụng", credits: 4, score: 7.0, point4: 2.80, letter: "B", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITNW30103", name: "Nhập môn mạng máy tính và điện toán đám mây", credits: 3, score: 8.7, point4: 3.48, letter: "A", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITSE30103", name: "Kỹ thuật lập trình", credits: 3, score: 9.9, point4: 3.96, letter: "A+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71PEVB10022", name: "Bóng chuyền", credits: 2, score: 9.5, point4: 3.80, letter: "A+", semester: "2024-2025 HK02", area: "Giáo dục thể chất", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLP10013", name: "Triết học Mác-Lênin", credits: 3, score: 7.2, point4: 2.88, letter: "B", semester: "2024-2025 HK02", area: "Lý luận chính trị", status: "Đạt" },

                // 2024-2025 HK03
                { code: "71ENG21023", name: "Anh văn 2 (AV2)", credits: 3, score: 8.3, point4: 3.32, letter: "B+", semester: "2024-2025 HK03", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITIS30103", name: "Cơ sở dữ liệu", credits: 3, score: 7.5, point4: 3.00, letter: "B", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30303", name: "Cấu trúc dữ liệu và giải thuật", credits: 3, score: 8.5, point4: 3.40, letter: "A", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71MATL10053", name: "Đại số tuyến tính và ứng dụng", credits: 3, score: 8.4, point4: 3.36, letter: "B+", semester: "2024-2025 HK03", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71NAD11013", name: "GDQP1: Đường lối QP và AN của ĐCSVN", credits: 3, score: 9.3, point4: 3.72, letter: "A+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD21002", name: "GDQP2: Công tác quốc phòng và an ninh", credits: 2, score: 9.6, point4: 3.84, letter: "A+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD31003", name: "GDQP3: Quân sự chung", credits: 2, score: 9.3, point4: 3.72, letter: "A+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD41044", name: "GDQP4: Kỹ thuật chiến đấu bộ binh và chiến thuật", credits: 4, score: 8.8, point4: 3.52, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLE10022", name: "Kinh tế chính trị Mác-Lênin", credits: 2, score: 7.6, point4: 3.04, letter: "B", semester: "2024-2025 HK03", area: "Lý luận chính trị", status: "Đạt" },

                // 2025-2026 HK01
                { code: "71ENG31033", name: "Anh văn 3 (AV3)", credits: 3, score: 8.8, point4: 3.60, letter: "A", semester: "2025-2026 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10403", name: "Toán rời rạc", credits: 4, score: 9.6, point4: 3.84, letter: "A+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30203", name: "Lập trình hướng đối tượng", credits: 3, score: 8.4, point4: 3.36, letter: "B+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30503", name: "Lập trình ứng dụng web", credits: 3, score: 9.3, point4: 3.72, letter: "A+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30603", name: "Lập trình ứng dụng di động", credits: 3, score: 7.1, point4: 2.84, letter: "B", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71PESW10042", name: "Bơi lội", credits: 2, score: 9.4, point4: 3.76, letter: "A+", semester: "2025-2026 HK01", area: "Giáo dục thể chất", status: "Đạt", countCredit: false, countGpa: false },

                // 2025-2026 HK02
                { code: "71ENG41043", name: "Anh văn 4 (AV4)", credits: 3, score: 8.4, point4: 3.36, letter: "B+", semester: "2025-2026 HK02", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITDS30103", name: "Các nền tảng phát triển phần mềm", credits: 3, score: 9.0, point4: 3.60, letter: "A+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITIS30303", name: "Quản lý dự án công nghệ thông tin", credits: 3, score: 8.8, point4: 3.52, letter: "A", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30403", name: "Lập trình ứng dụng Java", credits: 3, score: 9.1, point4: 3.64, letter: "A+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71POLS10032", name: "Chủ nghĩa xã hội khoa học", credits: 2, score: 9.1, point4: 3.64, letter: "A+", semester: "2025-2026 HK02", area: "Lý luận chính trị", status: "Đạt" }
            ]
        }
        ,"2474802010458": {
            mssv: "2474802010458",
            name: "Trương Trần Thanh Phương",
            cohort: "K30",
            major: "Công nghệ thông tin",
            className: "K30 CNTT",
            source: "Bảng điểm sinh viên cung cấp - cập nhật 2025-2026 HK02",
            officialCumulativeGpa4: 3.24,
            officialCumulativeCredits: 72,
            officialRating: "Giỏi",
            courses: [
                // Điểm bảo lưu
                { code: "71ENG01012", name: "Anh văn dự bị (AV0)", credits: 2, score: null, point4: null, letter: "MT", semester: "Điểm bảo lưu", area: "Ngoại ngữ", status: "Miễn/ bảo lưu", countCredit: false, countGpa: false },

                // 2024-2025 HK01
                { code: "71ENG01000", name: "Kiểm tra tiếng Anh đầu khóa", credits: 0, score: 5.0, point4: 2.00, letter: "D", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71ENG11013", name: "Anh văn 1 (AV1)", credits: 3, score: 7.8, point4: 3.12, letter: "B", semester: "2024-2025 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITBS10103", name: "Nhập môn công nghệ thông tin", credits: 3, score: 8.1, point4: 3.24, letter: "B+", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITBS10203", name: "Cơ sở lập trình", credits: 3, score: 7.0, point4: 2.80, letter: "B", semester: "2024-2025 HK01", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71SSK11023", name: "Kỹ năng công dân toàn cầu", credits: 3, score: 9.0, point4: 3.60, letter: "A+", semester: "2024-2025 HK01", area: "Kỹ năng", status: "Đạt" },

                // 2024-2025 HK02
                { code: "71ENG21023", name: "Anh văn 2 (AV2)", credits: 3, score: 7.1, point4: 2.84, letter: "B", semester: "2024-2025 HK02", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10104", name: "Toán cao cấp và ứng dụng", credits: 4, score: 6.5, point4: 2.60, letter: "C+", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt thấp" },
                { code: "71ITNW30103", name: "Nhập môn mạng máy tính và điện toán đám mây", credits: 3, score: 8.6, point4: 3.44, letter: "A", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71ITSE30103", name: "Kỹ thuật lập trình", credits: 3, score: 8.8, point4: 3.52, letter: "A", semester: "2024-2025 HK02", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71PEKC10062", name: "Cờ vua", credits: 2, score: 8.5, point4: 3.40, letter: "A", semester: "2024-2025 HK02", area: "Giáo dục thể chất", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLP10013", name: "Triết học Mác-Lênin", credits: 3, score: 7.5, point4: 3.00, letter: "B", semester: "2024-2025 HK02", area: "Lý luận chính trị", status: "Đạt" },

                // 2024-2025 HK03
                { code: "71ENG31033", name: "Anh văn 3 (AV3)", credits: 3, score: 6.4, point4: 2.56, letter: "C", semester: "2024-2025 HK03", area: "Ngoại ngữ", status: "Đạt thấp" },
                { code: "71ITIS30103", name: "Cơ sở dữ liệu", credits: 3, score: 7.9, point4: 3.16, letter: "B", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30303", name: "Cấu trúc dữ liệu và giải thuật", credits: 3, score: 8.4, point4: 3.36, letter: "B+", semester: "2024-2025 HK03", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71MATL10053", name: "Đại số tuyến tính và ứng dụng", credits: 3, score: 8.9, point4: 3.56, letter: "A", semester: "2024-2025 HK03", area: "Cơ sở khối ngành", status: "Đạt" },
                { code: "71NAD11013", name: "GDQP1: Đường lối QP và AN của ĐCSVN", credits: 3, score: 8.6, point4: 3.44, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD21002", name: "GDQP2: Công tác quốc phòng và an ninh", credits: 2, score: 8.8, point4: 3.52, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD31003", name: "GDQP3: Quân sự chung", credits: 2, score: 8.8, point4: 3.52, letter: "A", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71NAD41044", name: "GDQP4: Kỹ thuật chiến đấu bộ binh và chiến thuật", credits: 4, score: 8.1, point4: 3.24, letter: "B+", semester: "2024-2025 HK03", area: "Giáo dục quốc phòng", status: "Đạt", countCredit: false, countGpa: false },
                { code: "71POLE10022", name: "Kinh tế chính trị Mác-Lênin", credits: 2, score: 8.7, point4: 3.48, letter: "A", semester: "2024-2025 HK03", area: "Lý luận chính trị", status: "Đạt" },

                // 2025-2026 HK01
                { code: "71ENG41043", name: "Anh văn 4 (AV4)", credits: 3, score: 7.4, point4: 2.96, letter: "B", semester: "2025-2026 HK01", area: "Ngoại ngữ", status: "Đạt" },
                { code: "71ITMA10403", name: "Toán rời rạc", credits: 4, score: 9.7, point4: 3.88, letter: "A+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30203", name: "Lập trình hướng đối tượng", credits: 3, score: 8.2, point4: 3.28, letter: "B+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30503", name: "Lập trình ứng dụng web", credits: 3, score: 9.3, point4: 3.72, letter: "A+", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30603", name: "Lập trình ứng dụng di động", credits: 3, score: 7.9, point4: 3.16, letter: "B", semester: "2025-2026 HK01", area: "Cơ sở ngành", status: "Đạt" },

                // 2025-2026 HK02
                { code: "71ENG51053", name: "Anh văn 5 (AV5)", credits: 3, score: 6.3, point4: 2.52, letter: "C", semester: "2025-2026 HK02", area: "Ngoại ngữ", status: "Đạt thấp" },
                { code: "71ITDS30103", name: "Các nền tảng phát triển phần mềm", credits: 3, score: 9.0, point4: 3.60, letter: "A+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITIS30303", name: "Quản lý dự án công nghệ thông tin", credits: 3, score: 8.1, point4: 3.24, letter: "B+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71ITSE30403", name: "Lập trình ứng dụng Java", credits: 3, score: 9.9, point4: 3.96, letter: "A+", semester: "2025-2026 HK02", area: "Cơ sở ngành", status: "Đạt" },
                { code: "71POLS10032", name: "Chủ nghĩa xã hội khoa học", credits: 2, score: 8.1, point4: 3.24, letter: "B+", semester: "2025-2026 HK02", area: "Lý luận chính trị", status: "Đạt" }
            ]
        }


    };

    let activeStudent = null;
    let courseData = [];

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.querySelector('.gpa-page')) return;

        loadKnowledgeFile();
        bindEvents();
        resetDashboard();
        initMiniBot();
    });

    function bindEvents() {
        const semesterFilter = document.getElementById('semesterFilter');
        const courseSearch = document.getElementById('courseSearch');
        const lookupBtn = document.getElementById('lookupStudentBtn');
        const studentCodeInput = document.getElementById('studentCodeInput');
        const convertBtn = document.getElementById('convertBtn');
        const scoreInput = document.getElementById('scoreInput');
        const toggleKnowledgeBtn = document.getElementById('toggleKnowledgeBtn');

        semesterFilter?.addEventListener('change', renderDashboard);
        courseSearch?.addEventListener('input', renderCourseTable);
        lookupBtn?.addEventListener('click', lookupStudent);
        studentCodeInput?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') lookupStudent();
        });
        convertBtn?.addEventListener('click', convertScore);
        scoreInput?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') convertScore();
        });
        toggleKnowledgeBtn?.addEventListener('click', () => {
            document.getElementById('knowledgeContent')?.classList.toggle('is-collapsed');
        });
    }

    function lookupStudent() {
        const input = document.getElementById('studentCodeInput');
        if (!input) return;

        const mssv = normalizeMssv(input.value);
        if (!mssv) {
            setLookupNote('Vui lòng nhập MSSV trước khi tra cứu.', 'warning');
            addBotMessage('<strong>Chưa nhập MSSV.</strong><br>Bạn nhập MSSV vào ô bên trái rồi bấm Tra cứu nha.');
            return;
        }

        const student = STUDENT_DATABASE[mssv];
        if (!student) {
            activeStudent = null;
            courseData = [];
            resetDashboard();
            setLookupNote(`Chưa có dữ liệu cho MSSV ${escapeHtml(mssv)}. Gửi mình dữ liệu 5 sinh viên, mình sẽ cập nhật vào code.`, 'warning');
            addBotMessage(`<strong>Chưa tìm thấy MSSV ${escapeHtml(mssv)}.</strong><br>Code đã có sẵn chức năng tra cứu. Hiện chỉ cần bổ sung dữ liệu bảng điểm thật vào biến <strong>STUDENT_DATABASE</strong>.`);
            return;
        }

        activeStudent = normalizeStudent(student, mssv);
        courseData = activeStudent.courses;
        updateStudentProfile();
        populateSemesterFilter();
        renderDashboard();
        setLookupNote(`Đã tải dữ liệu của ${activeStudent.name}.`, 'success');
        addBotMessage(buildStudentLoadedReply());
    }

    function normalizeMssv(value) {
        return String(value || '').trim().replace(/\s+/g, '');
    }

    function normalizeStudent(student, fallbackMssv) {
        const courses = Array.isArray(student.courses) ? student.courses.map((course, index) => ({
            code: String(course.code || `MON${index + 1}`).trim(),
            name: String(course.name || 'Chưa rõ tên môn').trim(),
            credits: Number(course.credits || 0),
            score: course.score === null || course.score === undefined || course.score === '' ? null : Number(course.score),
            letter: course.letter ? String(course.letter).trim().toUpperCase() : '',
            point4: course.point4 === null || course.point4 === undefined || course.point4 === '' ? null : Number(course.point4),
            semester: String(course.semester || 'Chưa rõ học kỳ').trim(),
            area: String(course.area || 'Chưa phân nhóm').trim(),
            status: course.status ? String(course.status).trim() : '',
            countCredit: course.countCredit === false ? false : true,
            countGpa: course.countGpa === false ? false : true
        })) : [];

        return {
            mssv: String(student.mssv || fallbackMssv).trim(),
            name: String(student.name || 'Sinh viên VLU').trim(),
            cohort: String(student.cohort || 'K30').trim(),
            major: String(student.major || 'Công nghệ thông tin').trim(),
            className: String(student.className || '').trim(),
            source: String(student.source || 'Dữ liệu demo').trim(),
            officialCumulativeGpa4: student.officialCumulativeGpa4 === undefined ? null : Number(student.officialCumulativeGpa4),
            officialCumulativeCredits: student.officialCumulativeCredits === undefined ? null : Number(student.officialCumulativeCredits),
            officialRating: student.officialRating ? String(student.officialRating).trim() : '',
            courses
        };
    }

    function updateStudentProfile() {
        const avatar = document.getElementById('studentAvatar');
        const name = document.getElementById('studentName');
        const mssv = document.getElementById('studentMssv');
        const major = document.getElementById('studentMajor');
        const source = document.getElementById('studentSource');
        const badge = document.getElementById('dataStatusBadge');

        if (!activeStudent) return;

        if (avatar) avatar.textContent = getInitials(activeStudent.name);
        if (name) name.textContent = activeStudent.name;
        if (mssv) mssv.innerHTML = `<i class="fas fa-id-card"></i> MSSV: ${escapeHtml(activeStudent.mssv)}`;
        if (major) major.innerHTML = `<i class="fas fa-layer-group"></i> ${escapeHtml(activeStudent.cohort)} · ${escapeHtml(activeStudent.major)}`;
        if (source) source.innerHTML = `<i class="fas fa-calendar-check"></i> Nguồn: ${escapeHtml(activeStudent.source)}`;
        if (badge) {
            badge.classList.add('is-ready');
            badge.innerHTML = '<i class="fas fa-circle-check"></i> Đã có dữ liệu';
        }
    }

    function getInitials(name) {
        const parts = String(name || 'VL').trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return `${parts[parts.length - 2][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
    }

    function setLookupNote(message, type = 'default') {
        const note = document.getElementById('lookupNote');
        if (!note) return;
        note.textContent = message;
        note.style.color = type === 'success' ? '#15803d' : type === 'warning' ? '#b45309' : '#667085';
    }

    function resetDashboard() {
        const avatar = document.getElementById('studentAvatar');
        const name = document.getElementById('studentName');
        const mssv = document.getElementById('studentMssv');
        const major = document.getElementById('studentMajor');
        const source = document.getElementById('studentSource');
        const badge = document.getElementById('dataStatusBadge');

        if (avatar) avatar.textContent = 'VL';
        if (name) name.textContent = 'Sinh viên VLU';
        if (mssv) mssv.innerHTML = '<i class="fas fa-id-card"></i> MSSV: —';
        if (major) major.innerHTML = '<i class="fas fa-layer-group"></i> Khóa/ngành: chưa chọn';
        if (source) source.innerHTML = '<i class="fas fa-calendar-check"></i> Nguồn: dữ liệu nội bộ demo';
        if (badge) {
            badge.classList.remove('is-ready');
            badge.innerHTML = '<i class="fas fa-database"></i> Chờ nhập MSSV';
        }

        courseData = [];
        populateSemesterFilter();
        renderDashboard();
    }

    function populateSemesterFilter() {
        const semesterFilter = document.getElementById('semesterFilter');
        if (!semesterFilter) return;

        const current = semesterFilter.value || 'all';
        const semesters = [...new Set(courseData.map(course => course.semester).filter(Boolean))];
        semesterFilter.innerHTML = '<option value="all">Tất cả học kỳ</option>' + semesters.map(semester => `<option value="${escapeHtml(semester)}">${escapeHtml(semester)}</option>`).join('');
        semesterFilter.value = semesters.includes(current) ? current : 'all';
    }

    function getFilteredCourses() {
        const semester = document.getElementById('semesterFilter')?.value || 'all';
        if (semester === 'all') return [...courseData];
        return courseData.filter(course => course.semester === semester);
    }

    function getDisplayedCourses() {
        const keyword = (document.getElementById('courseSearch')?.value || '').trim().toLowerCase();
        const filtered = getFilteredCourses();
        if (!keyword) return filtered;

        return filtered.filter(course => {
            return course.code.toLowerCase().includes(keyword) ||
                course.name.toLowerCase().includes(keyword) ||
                course.area.toLowerCase().includes(keyword);
        });
    }

    function renderDashboard() {
        renderSummaryCards();
        renderProgress();
        renderSemesterBars();
        renderInsights();
        renderCourseTable();
    }

    function renderSummaryCards() {
        const summaryGrid = document.getElementById('summaryGrid');
        if (!summaryGrid) return;

        const courses = getFilteredCourses();
        const stats = calculateStats(courses);
        const hasData = courses.length > 0;
        const isAllView = (document.getElementById('semesterFilter')?.value || 'all') === 'all';
        const displayGpa4 = isAllView && activeStudent?.officialCumulativeGpa4 ? Number(activeStudent.officialCumulativeGpa4) : stats.gpa4;
        const displayCredits = isAllView && activeStudent?.officialCumulativeCredits ? Number(activeStudent.officialCumulativeCredits) : stats.passedCredits;
        const riskCount = courses.filter(isFailedCourse).length;
        const improvementCount = courses.filter(isImprovementCourse).length;
        const rating = hasData ? (activeStudent?.officialRating ? { title: activeStudent.officialRating, note: 'Theo điểm tích lũy hiện tại.' } : getRating(stats.gpa4)) : { title: 'Chờ dữ liệu', note: 'Nhập MSSV để xem xếp loại.' };

        const cards = [
            {
                icon: 'fa-chart-simple',
                label: 'GPA hệ 4',
                value: hasData && (stats.gpaCreditBase || activeStudent?.officialCumulativeGpa4) ? displayGpa4.toFixed(2) : '—',
                note: hasData && stats.avg10CreditBase ? `Điểm TB hệ 10: ${stats.avg10.toFixed(2)}` : 'Sẽ hiện khi có điểm hệ 10/chữ'
            },
            {
                icon: 'fa-book-open-reader',
                label: 'Tín chỉ đạt',
                value: hasData ? `${displayCredits}/${TOTAL_PROGRAM_CREDITS}` : `0/${TOTAL_PROGRAM_CREDITS}`,
                note: hasData ? `Tổng đã học: ${stats.attemptedCredits} TC` : 'Chưa có tín chỉ từ bảng điểm'
            },
            {
                icon: 'fa-triangle-exclamation',
                label: 'Cần lưu ý',
                value: hasData ? `${riskCount + improvementCount}` : '—',
                note: hasData ? `${riskCount} môn chưa đạt, ${improvementCount} môn nên cải thiện` : 'Chưa thể phân tích khi chưa có điểm'
            },
            {
                icon: 'fa-award',
                label: 'Xếp loại tạm tính',
                value: rating.title,
                note: rating.note
            }
        ];

        summaryGrid.innerHTML = cards.map(card => `
            <div class="summary-card">
                <div class="card-icon"><i class="fas ${card.icon}"></i></div>
                <p>${card.label}</p>
                <strong>${card.value}</strong>
                <span>${card.note}</span>
            </div>
        `).join('');
    }

    function renderProgress() {
        const courses = getFilteredCourses();
        const stats = calculateStats(courses);
        const percent = Math.min(100, Math.round((stats.passedCredits / TOTAL_PROGRAM_CREDITS) * 100));

        const progressBar = document.getElementById('creditProgressBar');
        const progressChip = document.getElementById('progressChip');
        const passedCreditText = document.getElementById('passedCreditText');
        const missingCreditText = document.getElementById('missingCreditText');

        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressChip) progressChip.textContent = `${stats.passedCredits}/${TOTAL_PROGRAM_CREDITS} TC`;
        if (passedCreditText) passedCreditText.textContent = stats.attemptedCredits ? `Đã đạt: ${stats.passedCredits} tín chỉ (${percent}%)` : 'Đã đạt: chờ nhập MSSV';
        if (missingCreditText) missingCreditText.textContent = stats.attemptedCredits ? `Còn thiếu: ${Math.max(0, TOTAL_PROGRAM_CREDITS - stats.passedCredits)} tín chỉ` : 'Còn thiếu: chưa xác định';
    }

    function renderSemesterBars() {
        const container = document.getElementById('semesterBars');
        if (!container) return;

        if (!courseData.length) {
            container.innerHTML = `
                <div class="empty-state compact">
                    <i class="fas fa-id-card-clip"></i>
                    <strong>Chưa chọn sinh viên</strong>
                    <p>Nhập MSSV ở phía trên để tải bảng điểm, GPA và tín chỉ theo học kỳ.</p>
                </div>
            `;
            return;
        }

        const semesters = [...new Set(courseData.map(course => course.semester))];
        container.innerHTML = semesters.map(semester => {
            const courses = courseData.filter(course => course.semester === semester);
            const gpa = calculateStats(courses).gpa4;
            const width = Math.max(8, Math.round((gpa / 4) * 100));
            return `
                <div class="semester-bar-row">
                    <span>${escapeHtml(semester)}</span>
                    <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
                    <strong>${gpa ? gpa.toFixed(2) : '—'}</strong>
                </div>
            `;
        }).join('');
    }

    function renderCourseTable() {
        const tableBody = document.getElementById('courseTableBody');
        if (!tableBody) return;

        const courses = getDisplayedCourses();

        if (!courses.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-table-cell">
                        <div class="empty-state">
                            <i class="fas fa-file-circle-question"></i>
                            <strong>Chưa có bảng điểm cho MSSV đang tra cứu</strong>
                            <p>Khi bạn gửi dữ liệu 5 sinh viên, mình sẽ cập nhật để nhập MSSV là tự hiện bảng điểm, GPA, tín chỉ và môn cần cải thiện.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const groupedBySemester = groupCoursesBySemester(courses);

        tableBody.innerHTML = groupedBySemester.map(group => {
            const semesterStats = calculateStats(group.courses);
            const semesterRating = semesterStats.gpaCreditBase ? getRating(semesterStats.gpa4).title : 'Chưa tính';
            const semesterCourseCount = group.courses.length;
            const semesterRows = group.courses.map(course => {
                const grade = getGradeInfo(course);
                const status = getCourseStatus(course);
                return `
                    <tr class="course-row">
                        <td><strong>${escapeHtml(course.code)}</strong></td>
                        <td>${escapeHtml(course.name)}<br><small>${escapeHtml(course.area)}</small></td>
                        <td>${course.credits}</td>
                        <td>${typeof course.score === 'number' && !Number.isNaN(course.score) ? course.score.toFixed(1) : '—'}</td>
                        <td>${escapeHtml(grade.letter)}</td>
                        <td><span class="status-pill ${status.className}">${escapeHtml(status.text)}</span></td>
                    </tr>
                `;
            }).join('');

            return `
                <tr class="semester-section-row">
                    <td colspan="6">
                        <div class="semester-section-card">
                            <div>
                                <span class="semester-label">Học kỳ</span>
                                <strong>${escapeHtml(group.semester)}</strong>
                            </div>
                            <div class="semester-stats">
                                <span>${semesterCourseCount} môn</span>
                                <span>${semesterStats.passedCredits} TC đạt</span>
                                <span>GPA HK: ${semesterStats.gpaCreditBase ? semesterStats.gpa4.toFixed(2) : '—'}</span>
                                <span>${escapeHtml(semesterRating)}</span>
                            </div>
                        </div>
                    </td>
                </tr>
                ${semesterRows}
            `;
        }).join('');
    }

    function groupCoursesBySemester(courses) {
        const groups = [];
        const indexBySemester = new Map();

        courses.forEach(course => {
            const semester = course.semester || 'Chưa rõ học kỳ';
            if (!indexBySemester.has(semester)) {
                indexBySemester.set(semester, groups.length);
                groups.push({ semester, courses: [] });
            }
            groups[indexBySemester.get(semester)].courses.push(course);
        });

        return groups;
    }

    function renderInsights() {
        const insightList = document.getElementById('insightList');
        if (!insightList) return;

        const courses = getFilteredCourses();
        if (!courses.length) {
            insightList.innerHTML = `
                <div class="insight-item">
                    <i class="fas fa-database"></i>
                    <div>
                        <strong>Chưa có dữ liệu điểm cá nhân</strong>
                        <p>Code đã có sẵn ô nhập MSSV. Sau khi bổ sung 5 bảng điểm, trang sẽ tự tính GPA, tín chỉ và môn cần lưu ý.</p>
                    </div>
                </div>
                <div class="insight-item success">
                    <i class="fas fa-clipboard-list"></i>
                    <div>
                        <strong>Đã chuẩn bị cấu trúc dữ liệu</strong>
                        <p>Dữ liệu sinh viên sẽ được đặt trong biến <strong>STUDENT_DATABASE</strong> theo từng MSSV.</p>
                    </div>
                </div>
                <div class="insight-item warning">
                    <i class="fas fa-user-plus"></i>
                    <div>
                        <strong>Bước tiếp theo</strong>
                        <p>Gửi mình 5 MSSV và bảng điểm tương ứng, mình sẽ nhập vào code để tra cứu trực tiếp.</p>
                    </div>
                </div>
            `;
            return;
        }

        const stats = calculateStats(courses);
        const failedCourses = courses.filter(isFailedCourse);
        const improvementCourses = courses.filter(isImprovementCourse);
        const bestCourse = [...courses].filter(course => typeof course.score === 'number').sort((a, b) => b.score - a.score)[0];

        const items = [
            {
                type: 'success',
                icon: 'fa-circle-check',
                title: 'Tổng quan học tập',
                text: `${activeStudent?.name || 'Sinh viên'} đang đạt ${activeStudent?.officialCumulativeCredits || stats.passedCredits}/${TOTAL_PROGRAM_CREDITS} tín chỉ. GPA hệ 4 tạm tính: ${activeStudent?.officialCumulativeGpa4 ? Number(activeStudent.officialCumulativeGpa4).toFixed(2) : (stats.gpaCreditBase ? stats.gpa4.toFixed(2) : 'chưa đủ dữ liệu')}.`
            },
            {
                type: failedCourses.length ? 'warning' : 'success',
                icon: failedCourses.length ? 'fa-triangle-exclamation' : 'fa-shield-heart',
                title: failedCourses.length ? 'Môn cần xử lý trước' : 'Không có môn rớt',
                text: failedCourses.length ? `Ưu tiên học lại/xử lý: ${failedCourses.map(course => course.name).join(', ')}.` : 'Các môn trong dữ liệu hiện tại đều đạt yêu cầu tối thiểu.'
            },
            {
                type: improvementCourses.length ? 'warning' : 'success',
                icon: improvementCourses.length ? 'fa-arrow-trend-up' : 'fa-star',
                title: improvementCourses.length ? 'Môn nên cải thiện' : 'Điểm đang ổn',
                text: improvementCourses.length ? `Nên cải thiện nhóm: ${improvementCourses.map(course => course.name).join(', ')}.` : (bestCourse ? `Môn nổi bật: ${bestCourse.name} với ${bestCourse.score.toFixed(1)} điểm.` : 'Chưa có điểm hệ 10 để phân tích môn nổi bật.')
            }
        ];

        insightList.innerHTML = items.map(item => `
            <div class="insight-item ${item.type}">
                <i class="fas ${item.icon}"></i>
                <div>
                    <strong>${escapeHtml(item.title)}</strong>
                    <p>${escapeHtml(item.text)}</p>
                </div>
            </div>
        `).join('');
    }

    function calculateStats(courses) {
        const countedCourses = courses.filter(courseCountsForCredit);
        const gpaCourses = courses.filter(courseCountsForGpa);
        const attemptedCredits = countedCourses.reduce((sum, course) => sum + Number(course.credits || 0), 0);
        const passedCredits = countedCourses.reduce((sum, course) => sum + (isPassedCourse(course) ? Number(course.credits || 0) : 0), 0);

        let totalWeighted10 = 0;
        let avg10CreditBase = 0;
        let totalWeighted4 = 0;
        let gpaCreditBase = 0;

        gpaCourses.forEach(course => {
            const credits = Number(course.credits || 0);
            const grade = getGradeInfo(course);
            if (typeof course.score === 'number' && !Number.isNaN(course.score)) {
                totalWeighted10 += course.score * credits;
                avg10CreditBase += credits;
            }
            if (grade.point4 !== null && !Number.isNaN(grade.point4)) {
                totalWeighted4 += grade.point4 * credits;
                gpaCreditBase += credits;
            }
        });

        return {
            attemptedCredits,
            passedCredits,
            avg10CreditBase,
            gpaCreditBase,
            avg10: avg10CreditBase ? totalWeighted10 / avg10CreditBase : 0,
            gpa4: gpaCreditBase ? totalWeighted4 / gpaCreditBase : 0
        };
    }

    function courseCountsForCredit(course) {
        return course.countCredit !== false && Number(course.credits || 0) > 0;
    }

    function courseCountsForGpa(course) {
        return course.countGpa !== false && courseCountsForCredit(course);
    }

    function scoreToGrade(score) {
        const value = Number(score);
        if (Number.isNaN(value) || value < 0 || value > 10) {
            return { letter: 'N/A', point4: null, status: 'Điểm không hợp lệ' };
        }

        if (value >= 8.5) return { letter: 'A', point4: 4.0, status: 'Xuất sắc' };
        if (value >= 7.8) return { letter: 'B+', point4: 3.5, status: 'Tốt' };
        if (value >= 7.0) return { letter: 'B', point4: 3.0, status: 'Khá' };
        if (value >= 6.3) return { letter: 'C+', point4: 2.5, status: 'Trung bình khá' };
        if (value >= 5.5) return { letter: 'C', point4: 2.0, status: 'Trung bình' };
        if (value >= 5.0) return { letter: 'D+', point4: 1.5, status: 'Đạt thấp' };
        if (value >= 4.0) return { letter: 'D', point4: 1.0, status: 'Cần cải thiện' };
        return { letter: 'F', point4: 0, status: 'Không đạt' };
    }

    function letterToGrade(letter) {
        const map = {
            'A': { letter: 'A', point4: 4.0, status: 'Xuất sắc' },
            'B+': { letter: 'B+', point4: 3.5, status: 'Tốt' },
            'B': { letter: 'B', point4: 3.0, status: 'Khá' },
            'C+': { letter: 'C+', point4: 2.5, status: 'Trung bình khá' },
            'C': { letter: 'C', point4: 2.0, status: 'Trung bình' },
            'D+': { letter: 'D+', point4: 1.5, status: 'Đạt thấp' },
            'D': { letter: 'D', point4: 1.0, status: 'Cần cải thiện' },
            'F': { letter: 'F', point4: 0, status: 'Không đạt' }
        };
        return map[String(letter || '').toUpperCase()] || { letter: letter || '—', point4: null, status: 'Chưa rõ' };
    }

    function getGradeInfo(course) {
        if (course.point4 !== null && course.point4 !== undefined && !Number.isNaN(course.point4)) {
            return {
                letter: course.letter || (typeof course.score === 'number' ? scoreToGrade(course.score).letter : '—'),
                point4: Number(course.point4),
                status: course.status || (typeof course.score === 'number' ? scoreToGrade(course.score).status : 'Chưa rõ')
            };
        }
        if (typeof course.score === 'number' && !Number.isNaN(course.score)) return scoreToGrade(course.score);
        if (course.letter) return letterToGrade(course.letter);
        return { letter: '—', point4: null, status: course.status || 'Chưa rõ' };
    }

    function isPassedCourse(course) {
        const statusText = String(course.status || '').toLowerCase();
        if (statusText.includes('không đạt') || statusText.includes('học lại') || statusText.includes('rớt') || statusText.includes('chưa đạt')) return false;
        if (statusText.includes('đạt') || statusText.includes('pass')) return true;
        if (typeof course.score === 'number' && !Number.isNaN(course.score)) return course.score >= 5;
        const letter = String(course.letter || '').toUpperCase();
        if (!letter) return false;
        return !['F', 'N/A'].includes(letter);
    }

    function isFailedCourse(course) {
        return !isPassedCourse(course);
    }

    function isImprovementCourse(course) {
        if (typeof course.score === 'number' && !Number.isNaN(course.score)) return course.score >= 5 && course.score < 6.5;
        const letter = String(course.letter || '').toUpperCase();
        return ['D', 'D+', 'C'].includes(letter);
    }

    function getCourseStatus(course) {
        if (course.countCredit === false) return { text: 'Đạt / Không tính TC', className: 'status-neutral' };
        if (isFailedCourse(course)) return { text: 'Học lại', className: 'status-fail' };
        if (isImprovementCourse(course)) return { text: 'Nên cải thiện', className: 'status-warning' };
        return { text: 'Đạt', className: 'status-pass' };
    }

    function getRating(gpa4) {
        if (gpa4 >= 3.6) return { title: 'Xuất sắc', note: 'Có thể đặt mục tiêu học bổng.' };
        if (gpa4 >= 3.2) return { title: 'Giỏi', note: 'Duy trì môn chuyên ngành điểm cao.' };
        if (gpa4 >= 2.5) return { title: 'Khá', note: 'Ổn, nên nâng nhóm môn dưới 6.5.' };
        if (gpa4 >= 2.0) return { title: 'Trung bình', note: 'Cần theo dõi rủi ro học vụ.' };
        return { title: 'Cảnh báo', note: 'Nên ưu tiên học lại/cải thiện.' };
    }

    function convertScore() {
        const input = document.getElementById('scoreInput');
        const result = document.getElementById('convertResult');
        if (!input || !result) return;

        const score = Number(input.value);
        if (Number.isNaN(score) || score < 0 || score > 10) {
            result.innerHTML = '<strong>Điểm chưa hợp lệ.</strong><br>Vui lòng nhập số từ 0 đến 10.';
            return;
        }

        const grade = scoreToGrade(score);
        const status = score < 5 ? 'Học lại' : score < 6.5 ? 'Nên cải thiện' : 'Đạt';
        result.innerHTML = `
            <strong>${score.toFixed(1)} điểm hệ 10 = ${grade.letter}</strong><br>
            Điểm hệ 4 tương ứng: <strong>${grade.point4?.toFixed(1) || '—'}</strong>.<br>
            Trạng thái gợi ý: <strong>${status}</strong>.
        `;
    }

    function initMiniBot() {
        const sendBtn = document.getElementById('miniSendBtn');
        const input = document.getElementById('miniInput');
        const quickPrompts = document.querySelectorAll('[data-prompt]');

        sendBtn?.addEventListener('click', executeChat);
        input?.addEventListener('keydown', event => {
            if (event.key === 'Enter') executeChat();
        });
        quickPrompts.forEach(button => {
            button.addEventListener('click', () => {
                if (input) input.value = button.dataset.prompt || '';
                executeChat();
            });
        });
    }

    function executeChat() {
        const input = document.getElementById('miniInput');
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        addUserMessage(text);
        input.value = '';

        setTimeout(() => {
            addBotMessage(buildLocalReply(text));
        }, 250);
    }

    function addUserMessage(text) {
        const messages = document.getElementById('miniMessages');
        if (!messages) return;

        const div = document.createElement('div');
        div.className = 'user-msg';
        div.textContent = text;
        messages.appendChild(div);
        scrollMiniChatToBottom();
    }

    function addBotMessage(html) {
        const messages = document.getElementById('miniMessages');
        if (!messages) return;

        const div = document.createElement('div');
        div.className = 'bot-msg';
        div.innerHTML = html;
        messages.appendChild(div);
        scrollMiniChatToBottom();
    }

    function scrollMiniChatToBottom() {
        const chatbox = document.getElementById('miniChatbox');
        if (chatbox) chatbox.scrollTop = chatbox.scrollHeight;
    }

    function buildStudentLoadedReply() {
        const stats = calculateStats(courseData);
        const failedCourses = courseData.filter(isFailedCourse);
        const improvementCourses = courseData.filter(isImprovementCourse);
        return `
            <strong>Đã tra cứu MSSV ${escapeHtml(activeStudent.mssv)} - ${escapeHtml(activeStudent.name)}</strong><br><br>
            <strong>Tổng quan:</strong><br>
            - GPA hệ 4: <strong>${activeStudent?.officialCumulativeGpa4 ? Number(activeStudent.officialCumulativeGpa4).toFixed(2) : (stats.gpaCreditBase ? stats.gpa4.toFixed(2) : 'chưa đủ dữ liệu')}</strong><br>
            - Xếp loại tích lũy: <strong>${escapeHtml(activeStudent.officialRating || getRating(stats.gpa4).title)}</strong><br>
            - Tín chỉ đạt: <strong>${activeStudent?.officialCumulativeCredits || stats.passedCredits}/${TOTAL_PROGRAM_CREDITS}</strong><br>
            - Còn thiếu: <strong>${Math.max(0, TOTAL_PROGRAM_CREDITS - (activeStudent?.officialCumulativeCredits || stats.passedCredits))} TC</strong><br>
            - Môn cần lưu ý: <strong>${failedCourses.length + improvementCourses.length}</strong>
        `;
    }

    function buildLocalReply(text) {
        const lower = text.toLowerCase();
        const stats = calculateStats(getFilteredCourses());
        const hasData = getFilteredCourses().length > 0;

        const typedMssv = lower.match(/\b\d{8,15}\b/);
        if (typedMssv) {
            const input = document.getElementById('studentCodeInput');
            if (input) input.value = typedMssv[0];
            lookupStudent();
            return '<strong>Mình đã thử tra cứu MSSV bạn vừa nhập.</strong>';
        }

        const scoreMatch = lower.match(/\b(10|[0-9](?:[.,][0-9])?)\b/);
        if (lower.includes('quy đổi') || lower.includes('điểm chữ') || scoreMatch) {
            const parsedScore = scoreMatch ? Number(scoreMatch[1].replace(',', '.')) : null;
            if (parsedScore !== null && parsedScore >= 0 && parsedScore <= 10) {
                const grade = scoreToGrade(parsedScore);
                return `<strong>Kết quả quy đổi:</strong><br>${parsedScore.toFixed(1)} điểm hệ 10 tương ứng <strong>${grade.letter}</strong>, hệ 4 khoảng <strong>${grade.point4?.toFixed(1) || '—'}</strong>.<br><br><strong>Nhận xét:</strong><br>${grade.status}.`;
            }
        }

        if (!hasData) {
            return `<strong>Chưa có dữ liệu sinh viên.</strong><br>Bạn nhập MSSV ở ô tra cứu phía trên. Hiện code đã sẵn sàng, nhưng cần bạn gửi 5 bảng điểm/MSSV để mình cập nhật vào <strong>STUDENT_DATABASE</strong>.`;
        }

        const failedCourses = getFilteredCourses().filter(isFailedCourse);
        const improvementCourses = getFilteredCourses().filter(isImprovementCourse);

        if (lower.includes('gpa') || lower.includes('trung bình')) {
            return `<strong>GPA hiện tại:</strong><br>GPA hệ 4 là <strong>${activeStudent?.officialCumulativeGpa4 ? Number(activeStudent.officialCumulativeGpa4).toFixed(2) : (stats.gpaCreditBase ? stats.gpa4.toFixed(2) : 'chưa đủ dữ liệu')}</strong>${stats.avg10CreditBase ? `, điểm trung bình hệ 10 là <strong>${stats.avg10.toFixed(2)}</strong>` : ''}.`;
        }

        if (lower.includes('tín chỉ') || lower.includes('tc') || lower.includes('thiếu')) {
            return `<strong>Tín chỉ tích lũy:</strong><br>Bạn đang đạt <strong>${activeStudent?.officialCumulativeCredits || stats.passedCredits}/${TOTAL_PROGRAM_CREDITS}</strong> tín chỉ, còn thiếu <strong>${Math.max(0, TOTAL_PROGRAM_CREDITS - (activeStudent?.officialCumulativeCredits || stats.passedCredits))} tín chỉ</strong>.`;
        }

        if (lower.includes('cải thiện') || lower.includes('rớt') || lower.includes('học lại') || lower.includes('lưu ý')) {
            if (!failedCourses.length && !improvementCourses.length) {
                return '<strong>Môn cần lưu ý:</strong><br>Hiện chưa thấy môn rớt hoặc môn điểm thấp trong dữ liệu đang chọn.';
            }
            return `<strong>Môn cần lưu ý:</strong><br>${failedCourses.length ? `- Cần học lại/xử lý: ${failedCourses.map(course => course.name).join(', ')}.<br>` : ''}${improvementCourses.length ? `- Nên cải thiện: ${improvementCourses.map(course => course.name).join(', ')}.` : ''}`;
        }

        return `<strong>Mình đã hiểu câu hỏi.</strong><br>Hiện đang xem dữ liệu của <strong>${escapeHtml(activeStudent?.name || 'sinh viên')}</strong>. Bạn có thể hỏi: GPA hiện tại, còn thiếu bao nhiêu tín chỉ, môn nào cần cải thiện, hoặc nhập điểm để quy đổi.`;
    }

    function loadKnowledgeFile() {
        const displayBox = document.getElementById('knowledgeContent');
        if (!displayBox) return;

        fetch('/VLU-Chatbot/knowledge/khungK30.txt')
            .then(response => {
                if (!response.ok) throw new Error('Không tải được file khung chương trình.');
                return response.text();
            })
            .then(text => {
                displayBox.textContent = text || 'Chưa có dữ liệu khung chương trình.';
            })
            .catch(() => {
                displayBox.textContent = 'Chưa tải được file khung chương trình. Khi deploy, kiểm tra lại đường dẫn /VLU-Chatbot/knowledge/khungK30.txt.';
            });
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
