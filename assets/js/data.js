/* Dữ liệu mẫu (mock) – sẽ thay bằng API thật ở bản chính thức */
window.VLBV = window.VLBV || {};

VLBV.provinces = [
  { slug: 'tp-hcm', name: 'TP. Hồ Chí Minh', short: 'TP.HCM', districts: ['Quận 1', 'Quận 2 (TP Thủ Đức)', 'Quận 3', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Tân Bình', 'Gò Vấp', 'Phú Nhuận', 'Tân Phú'] },
  { slug: 'ha-noi', name: 'Hà Nội', short: 'Hà Nội', districts: ['Cầu Giấy', 'Đống Đa', 'Hoàn Kiếm', 'Nam Từ Liêm', 'Thanh Xuân', 'Hai Bà Trưng', 'Long Biên'] },
  { slug: 'binh-duong', name: 'Bình Dương', short: 'Bình Dương', districts: ['Thuận An', 'Dĩ An', 'Thủ Dầu Một', 'Bến Cát', 'Tân Uyên'] },
  { slug: 'dong-nai', name: 'Đồng Nai', short: 'Đồng Nai', districts: ['Biên Hòa', 'Long Thành', 'Nhơn Trạch', 'Trảng Bom'] },
  { slug: 'bac-ninh', name: 'Bắc Ninh', short: 'Bắc Ninh', districts: ['TP Bắc Ninh', 'Từ Sơn', 'Quế Võ', 'Yên Phong'] },
  { slug: 'da-nang', name: 'Đà Nẵng', short: 'Đà Nẵng', districts: ['Hải Châu', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu'] }
];

VLBV.shifts = [
  { id: '8h', name: 'Ca 8 tiếng' },
  { id: '12h', name: 'Ca 12 tiếng' },
  { id: 'dem', name: 'Ca đêm' },
  { id: 'gay', name: 'Ca gãy' },
  { id: '24h', name: 'Trực 24h' }
];

VLBV.targets = [
  { id: 'toa-nha', name: 'Tòa nhà / Chung cư', icon: 'building' },
  { id: 'kcn', name: 'Khu công nghiệp / Nhà máy', icon: 'factory' },
  { id: 'ngan-hang', name: 'Ngân hàng', icon: 'bank' },
  { id: 'su-kien', name: 'Sự kiện', icon: 'star' },
  { id: 've-si', name: 'Vệ sĩ', icon: 'shield' },
  { id: 'truong-hoc', name: 'Trường học / Bệnh viện', icon: 'school' }
];

VLBV.companies = [
  { id: 'long-hai', logo: '/assets/img/logos/long-hai.png', name: 'Công ty CP Dịch vụ Bảo vệ Long Hải', short: 'Long Hải', initials: 'LH', color: '#1f2a6b', verified: true, mst: '0312 456 789', license: 'GPKD ANTT số 245/GXN-PC06', size: '1.200+ nhân viên', founded: 2009, address: '68 Nguyễn Huệ, Quận 1, TP.HCM', phone: '0909 123 456', rating: 4.7, reviews: 182, about: 'Long Hải là đơn vị bảo vệ chuyên nghiệp hơn 15 năm, phục vụ hơn 300 mục tiêu tòa nhà văn phòng, chung cư cao cấp và trung tâm thương mại tại TP.HCM và các tỉnh lân cận. Cam kết trả lương đúng hạn ngày 5 hàng tháng, đóng BHXH đầy đủ, không thu bất kỳ khoản phí nào của người lao động.' },
  { id: 'an-phat', logo: '/assets/img/logos/an-phat.png', name: 'Công ty Dịch vụ Bảo vệ An Quốc', short: 'An Quốc', initials: 'AQ', color: '#7a5a12', verified: true, mst: '0108 765 432', license: 'GPKD ANTT số 118/GXN-PC06', size: '800+ nhân viên', founded: 2012, address: '25 Trần Duy Hưng, Cầu Giấy, Hà Nội', phone: '0912 345 678', rating: 4.5, reviews: 96, about: 'An Quốc cung cấp dịch vụ vệ sĩ, bảo vệ ngân hàng, áp tải tiền và bảo vệ sự kiện tại miền Bắc. Đội ngũ được đào tạo bài bản về võ thuật, PCCC và sơ cấp cứu.' },
  { id: 'phuong-nam', logo: '/assets/img/logos/phuong-nam.png', name: 'Công ty CP Dịch vụ Bảo vệ Phương Nam', short: 'Phương Nam', initials: 'PN', color: '#0f6b4f', verified: true, mst: '3702 111 222', license: 'GPKD ANTT số 77/GXN-PC06', size: '2.000+ nhân viên', founded: 2007, address: 'Lô C2, KCN VSIP 1, Thuận An, Bình Dương', phone: '0938 222 333', rating: 4.6, reviews: 241, about: 'Chuyên bảo vệ nhà máy, kho bãi tại các KCN Bình Dương, Đồng Nai. Có ký túc xá miễn phí, bếp ăn tập thể và xe đưa đón cho nhân viên.' },
  { id: 'thang-long', logo: '/assets/img/logos/thang-long.webp', name: 'Công ty TNHH MTV DV Bảo vệ Thăng Long', short: 'Thăng Long', initials: 'TL', color: '#8b1e2d', verified: true, mst: '0105 999 001', license: 'GPKD ANTT số 302/GXN-PC06', size: '600+ nhân viên', founded: 2014, address: '112 Láng Hạ, Đống Đa, Hà Nội', phone: '0983 456 111', rating: 4.3, reviews: 58, about: 'Thăng Long phục vụ các tòa nhà văn phòng, bệnh viện và trường học tại Hà Nội, Bắc Ninh với chế độ đãi ngộ ổn định.' },
  { id: 'sao-viet', name: 'Công ty TNHH An ninh Sao Việt', short: 'Sao Việt', initials: 'SV', color: '#2d4a8a', verified: false, mst: '0316 222 888', license: 'Đang chờ xác thực', size: '150+ nhân viên', founded: 2020, address: '45 Lê Văn Việt, TP Thủ Đức, TP.HCM', phone: '0977 888 999', rating: 4.0, reviews: 12, about: 'Đơn vị bảo vệ trẻ, chuyên bảo vệ sự kiện, triển lãm và cửa hàng bán lẻ.' },
  { id: 'hai-au', logo: '/assets/img/logos/hai-au.png', name: 'Công ty CP Vệ sĩ SOS', short: 'Vệ sĩ SOS', initials: 'SOS', color: '#0b6b8a', verified: true, mst: '0401 555 666', license: 'GPKD ANTT số 56/GXN-PC06', size: '400+ nhân viên', founded: 2011, address: '210 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng', phone: '0905 666 777', rating: 4.4, reviews: 44, about: 'Bảo vệ resort, khách sạn và chung cư ven biển Đà Nẵng. Môi trường làm việc chuyên nghiệp, thưởng lễ Tết đầy đủ.' }
];

/* Tin tuyển dụng. salaryMin/Max theo triệu đồng; daysLeft âm = đã hết hạn */
VLBV.jobs = [
  { id: 101, title: 'Tuyển 10 bảo vệ chung cư cao cấp Quận 2, ca 12 tiếng, bao ở', company: 'long-hai', province: 'tp-hcm', district: 'Quận 2 (TP Thủ Đức)', target: 'toa-nha', shift: '12h', salaryMin: 8, salaryMax: 9.5, qty: 10, housing: true, meals: false, tier: 'vip', urgent: true, posted: 0, daysLeft: 28, views: 1240, calls: 86, age: 'Nam 20–50 tuổi', height: 'Từ 1m65', address: 'Chung cư The Sun Avenue, Mai Chí Thọ, TP Thủ Đức' },
  { id: 102, title: 'Bảo vệ nhà máy KCN VSIP 1 – bao ăn 3 bữa, ký túc xá miễn phí', company: 'phuong-nam', province: 'binh-duong', district: 'Thuận An', target: 'kcn', shift: '12h', salaryMin: 8.5, salaryMax: 10, qty: 25, housing: true, meals: true, tier: 'vip', urgent: true, posted: 0, daysLeft: 25, views: 2310, calls: 154, age: 'Nam 18–50 tuổi', height: 'Từ 1m62', address: 'Lô C2, KCN VSIP 1, Thuận An, Bình Dương' },
  { id: 103, title: 'Bảo vệ ngân hàng khu vực Cầu Giấy – giờ hành chính', company: 'an-phat', province: 'ha-noi', district: 'Cầu Giấy', target: 'ngan-hang', shift: '8h', salaryMin: 9, salaryMax: 11, qty: 4, housing: false, meals: true, tier: 'vip', urgent: false, posted: 1, daysLeft: 22, views: 890, calls: 41, age: 'Nam 25–45 tuổi', height: 'Từ 1m68', address: 'Chi nhánh ngân hàng, 25 Trần Duy Hưng, Cầu Giấy' },
  { id: 104, title: 'Tuyển bảo vệ ca đêm tòa nhà văn phòng Quận 1', company: 'long-hai', province: 'tp-hcm', district: 'Quận 1', target: 'toa-nha', shift: 'dem', salaryMin: 8, salaryMax: 8.8, qty: 3, housing: false, meals: false, tier: 'urgent', urgent: true, posted: 1, daysLeft: 18, views: 640, calls: 33, age: 'Nam 22–55 tuổi', height: 'Không yêu cầu', address: 'Tòa nhà Saigon Centre, Lê Lợi, Quận 1' },
  { id: 105, title: 'Vệ sĩ riêng cho doanh nhân – yêu cầu võ thuật, lương cao', company: 'an-phat', province: 'ha-noi', district: 'Hoàn Kiếm', target: 've-si', shift: '12h', salaryMin: 15, salaryMax: 20, qty: 2, housing: false, meals: true, tier: 'vip', urgent: false, posted: 2, daysLeft: 20, views: 1820, calls: 72, age: 'Nam 23–38 tuổi', height: 'Từ 1m72', address: 'Hoàn Kiếm, Hà Nội' },
  { id: 106, title: 'Bảo vệ kho hàng KCN Amata Biên Hòa – trực 24/24', company: 'phuong-nam', province: 'dong-nai', district: 'Biên Hòa', target: 'kcn', shift: '24h', salaryMin: 9, salaryMax: 10.5, qty: 6, housing: true, meals: true, tier: 'normal', urgent: false, posted: 2, daysLeft: 26, views: 520, calls: 19, age: 'Nam 20–55 tuổi', height: 'Không yêu cầu', address: 'KCN Amata, Biên Hòa, Đồng Nai' },
  { id: 107, title: 'Tuyển bảo vệ bệnh viện Đống Đa, ca 8 tiếng xoay ca', company: 'thang-long', province: 'ha-noi', district: 'Đống Đa', target: 'truong-hoc', shift: '8h', salaryMin: 7.5, salaryMax: 8.5, qty: 5, housing: false, meals: false, tier: 'normal', urgent: false, posted: 3, daysLeft: 15, views: 410, calls: 12, age: 'Nam/Nữ 22–50 tuổi', height: 'Không yêu cầu', address: 'Đống Đa, Hà Nội' },
  { id: 108, title: 'Bảo vệ sự kiện, triển lãm cuối tuần – trả lương theo ngày', company: 'sao-viet', province: 'tp-hcm', district: 'Quận 7', target: 'su-kien', shift: 'gay', salaryMin: 6, salaryMax: 7.5, qty: 20, housing: false, meals: true, tier: 'normal', urgent: true, posted: 0, daysLeft: 12, views: 980, calls: 61, age: 'Nam 18–40 tuổi', height: 'Từ 1m65', address: 'SECC, Nguyễn Văn Linh, Quận 7' },
  { id: 109, title: 'Bảo vệ nhà máy điện tử KCN Quế Võ – bao ở, có xe đưa đón', company: 'thang-long', province: 'bac-ninh', district: 'Quế Võ', target: 'kcn', shift: '12h', salaryMin: 8.5, salaryMax: 9.5, qty: 15, housing: true, meals: true, tier: 'vip', urgent: true, posted: 1, daysLeft: 27, views: 1420, calls: 97, age: 'Nam 20–50 tuổi', height: 'Từ 1m63', address: 'KCN Quế Võ, Bắc Ninh' },
  { id: 110, title: 'Bảo vệ resort ven biển Sơn Trà – có chỗ ở', company: 'hai-au', province: 'da-nang', district: 'Sơn Trà', target: 'toa-nha', shift: '12h', salaryMin: 8, salaryMax: 9, qty: 6, housing: true, meals: true, tier: 'normal', urgent: false, posted: 4, daysLeft: 21, views: 300, calls: 9, age: 'Nam 20–45 tuổi', height: 'Từ 1m65', address: 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng' },
  { id: 111, title: 'Chỉ huy mục tiêu tòa nhà Bình Thạnh – 3 năm kinh nghiệm', company: 'long-hai', province: 'tp-hcm', district: 'Bình Thạnh', target: 'toa-nha', shift: '8h', salaryMin: 11, salaryMax: 13, qty: 1, housing: false, meals: false, tier: 'normal', urgent: false, posted: 3, daysLeft: 2, views: 760, calls: 28, age: 'Nam 28–50 tuổi', height: 'Không yêu cầu', address: 'Landmark, Điện Biên Phủ, Bình Thạnh' },
  { id: 112, title: 'Bảo vệ trường quốc tế Thủ Dầu Một – nghỉ Chủ nhật', company: 'phuong-nam', province: 'binh-duong', district: 'Thủ Dầu Một', target: 'truong-hoc', shift: '8h', salaryMin: 7.5, salaryMax: 8.5, qty: 3, housing: false, meals: true, tier: 'normal', urgent: false, posted: 5, daysLeft: 19, views: 280, calls: 7, age: 'Nam 25–55 tuổi', height: 'Không yêu cầu', address: 'Thủ Dầu Một, Bình Dương' },
  { id: 113, title: 'Bảo vệ siêu thị Tân Bình ca gãy – phù hợp sinh viên', company: 'sao-viet', province: 'tp-hcm', district: 'Tân Bình', target: 'su-kien', shift: 'gay', salaryMin: 6.5, salaryMax: 7.5, qty: 4, housing: false, meals: false, tier: 'normal', urgent: false, posted: 6, daysLeft: 9, views: 190, calls: 5, age: 'Nam 18–35 tuổi', height: 'Không yêu cầu', address: 'Cộng Hòa, Tân Bình' },
  { id: 114, title: 'Bảo vệ ngân hàng Hải Châu – giờ hành chính, thưởng quý', company: 'hai-au', province: 'da-nang', district: 'Hải Châu', target: 'ngan-hang', shift: '8h', salaryMin: 8.5, salaryMax: 9.5, qty: 2, housing: false, meals: true, tier: 'normal', urgent: false, posted: 7, daysLeft: 14, views: 220, calls: 6, age: 'Nam 25–45 tuổi', height: 'Từ 1m68', address: 'Hải Châu, Đà Nẵng' },
  { id: 115, title: 'Bảo vệ chung cư Gò Vấp ca 12h – nhận việc ngay', company: 'long-hai', province: 'tp-hcm', district: 'Gò Vấp', target: 'toa-nha', shift: '12h', salaryMin: 7.8, salaryMax: 8.5, qty: 4, housing: true, meals: false, tier: 'normal', urgent: false, posted: 40, daysLeft: -5, views: 980, calls: 40, age: 'Nam 20–55 tuổi', height: 'Không yêu cầu', address: 'Phan Văn Trị, Gò Vấp' }
];

VLBV.posts = [
  { id: 'bang-luong-bao-ve-2026', img: '/assets/img/photos/blog-luong.jpg', cat: 'Bảng lương', title: 'Bảng lương bảo vệ mới nhất 2026 tại TP.HCM, Hà Nội và Bình Dương', excerpt: 'Mức lương ca 8 tiếng, ca 12 tiếng, chỉ huy mục tiêu và các khoản phụ cấp ca đêm cập nhật theo lương tối thiểu vùng mới.', read: 6, views: 18420, date: '12/11/2026' },
  { id: 'dau-hieu-cong-ty-bao-ve-lua-dao', img: '/assets/img/photos/blog-lua-dao.jpg', cat: 'Cảnh báo lừa đảo', title: '5 dấu hiệu nhận biết công ty bảo vệ lừa đảo thu tiền đồng phục', excerpt: 'Cách kiểm tra giấy phép đủ điều kiện ANTT, nhận diện tin tuyển dụng thu phí và việc cần làm khi bị lừa.', read: 5, views: 42190, date: '08/11/2026' },
  { id: 'quy-trinh-tuan-tra-pccc', img: '/assets/img/photos/blog-tuan-tra.jpg', cat: 'Nghiệp vụ', title: 'Quy trình tuần tra và xử lý sự cố PCCC cho bảo vệ tòa nhà chung cư', excerpt: 'Tài liệu nghiệp vụ cơ bản giúp người mới vượt qua phỏng vấn và làm tốt ngay tuần đầu tiên.', read: 8, views: 12850, date: '02/11/2026' },
  { id: 'kinh-nghiem-phong-van-bao-ve', img: '/assets/img/photos/blog-phong-van.jpg', cat: 'Phỏng vấn', title: '10 câu hỏi phỏng vấn bảo vệ thường gặp và cách trả lời', excerpt: 'Chuẩn bị giấy tờ gì, ăn mặc ra sao và trả lời thế nào để được nhận ngay trong buổi đầu.', read: 4, views: 9310, date: '28/10/2026' },
  { id: 'ca-12-tieng-co-dung-luat', img: '/assets/img/photos/blog-ca-12.jpg', cat: 'Pháp lý', title: 'Làm ca 12 tiếng có đúng luật? Quyền lợi làm thêm giờ của bảo vệ', excerpt: 'Giải thích quy định giờ làm, tiền làm thêm và nghỉ hằng tuần theo Bộ luật Lao động.', read: 7, views: 7640, date: '20/10/2026' },
  { id: 'chung-chi-bao-ve-can-co', img: '/assets/img/photos/blog-chung-chi.jpg', cat: 'Nghề nghiệp', title: 'Những chứng chỉ giúp bảo vệ tăng lương: PCCC, võ thuật, sơ cấp cứu', excerpt: 'Học ở đâu, mất bao lâu và mỗi chứng chỉ giúp tăng thu nhập thêm bao nhiêu.', read: 5, views: 5120, date: '14/10/2026' }
];

VLBV.packages = [
  { id: 'free', name: 'Miễn phí', price: 0, unit: '', desc: 'Dùng thử cho công ty mới', features: ['3 tin đăng / tháng', 'Hiển thị 30 ngày', 'AI viết tin 5 lần / ngày', 'Nhận hồ sơ ứng tuyển'], cta: 'Bắt đầu miễn phí' },
  { id: 'vip', name: 'Tin VIP', price: 299000, unit: '/ tin / 30 ngày', desc: 'Nổi bật, luôn nằm đầu danh sách', features: ['Khung vàng + nhãn VIP', 'Ưu tiên trên trang khu vực', 'Gấp 5 lần lượt xem', 'AI viết tin không giới hạn', 'Báo cáo lượt xem / gọi'], cta: 'Mua tin VIP', featured: true },
  { id: 'urgent', name: 'Tin Gấp', price: 149000, unit: '/ tin / 7 ngày', desc: 'Cần người đi làm ngay', features: ['Nhãn “Tuyển gấp” màu cam', 'Hiển thị mục Việc gấp trang chủ', 'Gửi thông báo Zalo cho ứng viên gần đó'], cta: 'Mua tin Gấp' },
  { id: 'enterprise', name: 'Doanh nghiệp', price: 2490000, unit: '/ tháng', desc: 'Công ty tuyển số lượng lớn', features: ['30 tin VIP / tháng', '200 điểm xem hồ sơ', 'Quản lý ứng viên (mini-ATS)', 'Trang công ty nổi bật', 'Hỗ trợ riêng 1-1'], cta: 'Liên hệ tư vấn' }
];

VLBV.addons = [
  { name: 'Đẩy tin lên đầu', price: '39.000đ / lần', desc: 'Đưa tin về vị trí đầu danh sách ngay lập tức.' },
  { name: 'Gói 50 điểm xem hồ sơ', price: '250.000đ', desc: 'Mỗi điểm mở 1 số điện thoại ứng viên.' },
  { name: 'Gói 200 điểm xem hồ sơ', price: '800.000đ', desc: 'Tiết kiệm 20% cho nhà tuyển dụng lớn.' },
  { name: 'Banner trang chủ', price: '3.000.000đ / tháng', desc: 'Đồng phục, bộ đàm, thiết bị an ninh…' },
  { name: 'Banner cột bên trang khu vực', price: '1.200.000đ / tháng', desc: 'Nhắm đúng khu vực tỉnh / quận.' }
];

VLBV.candidates = [
  { name: 'Nguyễn Văn Hùng', age: 34, height: '1m70', area: 'Quận 7, TP.HCM', exp: 'Xuất ngũ, 5 năm bảo vệ tòa nhà', certs: ['PCCC'], status: 'new', job: 101, time: '10 phút trước' },
  { name: 'Trần Minh Tâm', age: 27, height: '1m72', area: 'Thủ Đức, TP.HCM', exp: 'Công an nghĩa vụ, 2 năm', certs: ['Võ thuật', 'PCCC'], status: 'called', job: 101, time: '1 giờ trước' },
  { name: 'Lê Quốc Bảo', age: 45, height: '1m66', area: 'Bình Thạnh, TP.HCM', exp: '8 năm chỉ huy mục tiêu', certs: ['PCCC', 'Sơ cấp cứu'], status: 'interview', job: 111, time: 'Hôm qua' },
  { name: 'Phạm Đức Thịnh', age: 22, height: '1m68', area: 'Quận 2, TP.HCM', exp: 'Chưa có kinh nghiệm', certs: [], status: 'new', job: 101, time: 'Hôm qua' },
  { name: 'Võ Thành Long', age: 39, height: '1m69', area: 'Gò Vấp, TP.HCM', exp: '6 năm bảo vệ chung cư', certs: ['PCCC'], status: 'hired', job: 115, time: '3 ngày trước' },
  { name: 'Đỗ Văn Nam', age: 51, height: '1m64', area: 'Quận 1, TP.HCM', exp: '10 năm bảo vệ ngân hàng', certs: [], status: 'rejected', job: 104, time: '4 ngày trước' }
];
