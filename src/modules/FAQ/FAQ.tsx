import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: string;
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "Mecha là gì?",
      answer: "Mecha là nền tảng cho phép bạn tạo và tùy chỉnh profile cá nhân với nhiều hiệu ứng đẹp mắt. Bạn có thể kết nối tất cả các mạng xã hội của mình và tạo một trang profile độc đáo để chia sẻ với mọi người.",
      icon: "bi-question-circle",
    },
    {
      id: 2,
      question: "Làm thế nào để đăng ký tài khoản?",
      answer: "Bạn có thể đăng ký bằng cách click vào nút 'Start' ở trang chủ và chọn đăng nhập bằng Discord. Sau khi xác thực với Discord, tài khoản của bạn sẽ được tạo tự động.",
      icon: "bi-person-plus",
    },
    {
      id: 3,
      question: "Làm thế nào để tùy chỉnh profile?",
      answer: "Sau khi đăng nhập, vào Dashboard và chọn 'Home' để chỉnh sửa profile. Bạn có thể tùy chỉnh avatar, username, mô tả, vị trí, liên kết xã hội, và nhiều style khác như màu sắc, border, background, cursor, v.v.",
      icon: "bi-palette",
    },
    {
      id: 4,
      question: "Làm thế nào để mua Effects?",
      answer: "Vào Dashboard → 'Effect' để xem các hiệu ứng có sẵn. Bạn có thể mua bằng Coins. Sau khi mua, effect sẽ được thêm vào tài khoản và bạn có thể áp dụng nó cho profile của mình.",
      icon: "bi-star",
    },
    {
      id: 5,
      question: "Làm thế nào để kiếm Coins?",
      answer: "Hiện tại, bạn có thể nhận Coins thông qua các hoạt động trong hệ thống hoặc mua từ shop. Chúng tôi đang phát triển thêm nhiều cách để kiếm Coins miễn phí.",
      icon: "bi-coin",
    },
    {
      id: 6,
      question: "Làm thế nào để chia sẻ profile của tôi?",
      answer: "Sau khi tạo profile, bạn sẽ có một URL duy nhất dạng: mecha.lol/username. Bạn có thể chia sẻ URL này với bạn bè hoặc đặt vào bio của các mạng xã hội khác.",
      icon: "bi-share",
    },
    {
      id: 7,
      question: "Tôi có thể thêm bao nhiêu liên kết xã hội?",
      answer: "Bạn có thể thêm nhiều liên kết xã hội như Instagram, Discord, Facebook, Twitter, YouTube, TikTok, v.v. Không có giới hạn số lượng liên kết bạn có thể thêm.",
      icon: "bi-link-45deg",
    },
    {
      id: 8,
      question: "Làm thế nào để thay đổi layout của profile?",
      answer: "Vào Dashboard → Home → Style Settings → Layout. Bạn có thể chọn từ các layout có sẵn như 'Link in Bio' (centered) hoặc 'Side Profile' (left-aligned). Mỗi layout có thể được tùy chỉnh thêm.",
      icon: "bi-layout-text-window",
    },
    {
      id: 9,
      question: "Tôi có thể tùy chỉnh cursor không?",
      answer: "Có! Vào Style Settings → Cursor, bạn có thể chọn loại cursor (circle, square, custom), màu sắc, kích thước, scale, và thậm chí upload cursor tùy chỉnh của riêng bạn.",
      icon: "bi-cursor",
    },
    {
      id: 10,
      question: "Làm thế nào để reset style về mặc định?",
      answer: "Trong mỗi phần style settings, bạn sẽ thấy nút 'Reset' để đưa các thiết lập về giá trị mặc định. Ví dụ, trong Container settings có nút Reset để reset tất cả các thuộc tính container.",
      icon: "bi-arrow-counterclockwise",
    },
    {
      id: 11,
      question: "Tôi có thể thêm audio vào profile không?",
      answer: "Có! Vào Style Settings → Audio, bạn có thể upload file audio và nó sẽ được phát tự động khi người dùng truy cập profile của bạn. Bạn cũng có thể tùy chỉnh các thuộc tính audio như autoplay, loop, volume.",
      icon: "bi-music-note-beamed",
    },
    {
      id: 12,
      question: "Làm thế nào để ủng hộ dự án?",
      answer: "Bạn có thể ủng hộ Mecha bằng cách vào Dashboard → Account → Donate. Chúng tôi chấp nhận chuyển khoản qua MB Bank. Mọi sự ủng hộ đều được đánh giá cao và giúp chúng tôi phát triển thêm nhiều tính năng mới!",
      icon: "bi-heart",
    },
    {
      id: 13,
      question: "Tài khoản của tôi có bị mất không?",
      answer: "Không, dữ liệu của bạn được lưu trữ an toàn trên server. Tuy nhiên, bạn nên đảm bảo đã liên kết tài khoản với Discord để có thể đăng nhập lại dễ dàng.",
      icon: "bi-shield-check",
    },
    {
      id: 14,
      question: "Tôi gặp lỗi khi đăng nhập bằng Discord, phải làm sao?",
      answer: "Nếu bạn gặp lỗi khi đăng nhập bằng Discord, vui lòng liên hệ hỗ trợ qua Discord server của chúng tôi để được hỗ trợ nhanh chóng.",
      icon: "bi-exclamation-triangle",
    },
    {
      id: 16,
      question: "Làm thế nào để kiếm Coins miễn phí?",
      answer: "Bạn có thể kiếm Coins miễn phí bằng cách tham gia Discord server của chúng tôi và chơi các trò chơi với bot Discord! Bot sẽ thưởng Coins cho các hoạt động và thành tích của bạn. Tham gia ngay để bắt đầu kiếm Coins!",
      icon: "bi-discord",
    },
    {
      id: 15,
      question: "Có giới hạn về kích thước file upload không?",
      answer: "Có, mỗi loại file có giới hạn riêng. Avatar thường giới hạn khoảng 5MB, background image/video có thể lớn hơn. Audio file cũng có giới hạn. Hệ thống sẽ thông báo nếu file của bạn vượt quá giới hạn.",
      icon: "bi-file-earmark",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <i className="bi bi-question-circle-fill text-5xl text-purple-400 animate-pulse"></i>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Câu Hỏi Thường Gặp
            </h1>
          </div>
          <p className="text-gray-300 text-lg mt-4">
            Tìm câu trả lời cho các câu hỏi phổ biến về Mecha
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openItems.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-purple-500/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <i className={`bi ${item.icon} text-2xl text-purple-400 flex-shrink-0`}></i>
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {item.question}
                    </h3>
                  </div>
                  <i
                    className={`bi ${
                      isOpen ? "bi-chevron-up" : "bi-chevron-down"
                    } text-purple-400 text-xl transition-transform duration-300 flex-shrink-0`}
                  ></i>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 pl-16 text-gray-300 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
          <i className="bi bi-envelope-heart text-3xl text-purple-400 mb-3"></i>
          <h3 className="text-xl font-semibold text-white mb-2">
            Vẫn chưa tìm thấy câu trả lời?
          </h3>
          <p className="text-gray-300 mb-4">
            Liên hệ với chúng tôi qua Discord hoặc email để được hỗ trợ
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/discord"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <i className="bi bi-discord"></i>
              <span>Discord Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

