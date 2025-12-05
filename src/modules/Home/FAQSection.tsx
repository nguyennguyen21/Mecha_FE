import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

interface FAQItem {
  id: number;
  questionVi: string;
  questionEn: string;
  answerVi: string;
  answerEn: string;
  icon: string;
}

const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [language, setLanguage] = useState<"vi" | "en">("vi");

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
      questionVi: "Mecha là gì?",
      questionEn: "What is Mecha?",
      answerVi: "Mecha là nền tảng cho phép bạn tạo và tùy chỉnh profile cá nhân với nhiều hiệu ứng đẹp mắt. Bạn có thể kết nối tất cả các mạng xã hội của mình và tạo một trang profile độc đáo để chia sẻ với mọi người.",
      answerEn: "Mecha is a platform that allows you to create and customize your personal profile with beautiful effects. You can connect all your social networks and create a unique profile page to share with others.",
      icon: "bi-question-circle",
    },
    {
      id: 2,
      questionVi: "Làm thế nào để đăng ký tài khoản?",
      questionEn: "How do I register an account?",
      answerVi: "Bạn có thể đăng ký bằng cách click vào nút 'Start' ở trang chủ và chọn đăng nhập bằng Discord. Sau khi xác thực với Discord, tài khoản của bạn sẽ được tạo tự động.",
      answerEn: "You can register by clicking the 'Start' button on the homepage and choosing to login with Discord. After authenticating with Discord, your account will be created automatically.",
      icon: "bi-person-plus",
    },
    {
      id: 3,
      questionVi: "Làm thế nào để tùy chỉnh profile?",
      questionEn: "How do I customize my profile?",
      answerVi: "Sau khi đăng nhập, vào Dashboard và chọn 'Home' để chỉnh sửa profile. Bạn có thể tùy chỉnh avatar, username, mô tả, vị trí, liên kết xã hội, và nhiều style khác như màu sắc, border, background, cursor, v.v.",
      answerEn: "After logging in, go to Dashboard and select 'Home' to edit your profile. You can customize avatar, username, description, location, social links, and many other styles like colors, borders, background, cursor, etc.",
      icon: "bi-palette",
    },
    {
      id: 4,
      questionVi: "Làm thế nào để mua Effects?",
      questionEn: "How do I purchase Effects?",
      answerVi: "Vào Dashboard → 'Effect' để xem các hiệu ứng có sẵn. Bạn có thể mua bằng Coins. Sau khi mua, effect sẽ được thêm vào tài khoản và bạn có thể áp dụng nó cho profile của mình.",
      answerEn: "Go to Dashboard → 'Effect' to see available effects. You can purchase them with Coins. After purchasing, the effect will be added to your account and you can apply it to your profile.",
      icon: "bi-star",
    },
    {
      id: 5,
      questionVi: "Làm thế nào để kiếm Coins?",
      questionEn: "How do I earn Coins?",
      answerVi: "Hiện tại, bạn có thể nhận Coins thông qua các hoạt động trong hệ thống hoặc mua từ shop. Chúng tôi đang phát triển thêm nhiều cách để kiếm Coins miễn phí.",
      answerEn: "Currently, you can earn Coins through system activities or purchase from the shop. We are developing more ways to earn Coins for free.",
      icon: "bi-coin",
    },
    {
      id: 6,
      questionVi: "Làm thế nào để chia sẻ profile của tôi?",
      questionEn: "How do I share my profile?",
      answerVi: "Sau khi tạo profile, bạn sẽ có một URL duy nhất dạng: mecha.lol/username. Bạn có thể chia sẻ URL này với bạn bè hoặc đặt vào bio của các mạng xã hội khác.",
      answerEn: "After creating your profile, you will have a unique URL like: mecha.lol/username. You can share this URL with friends or add it to your social media bio.",
      icon: "bi-share",
    },
    {
      id: 7,
      questionVi: "Tôi có thể thêm bao nhiêu liên kết xã hội?",
      questionEn: "How many social links can I add?",
      answerVi: "Bạn có thể thêm nhiều liên kết xã hội như Instagram, Discord, Facebook, Twitter, YouTube, TikTok, v.v. Không có giới hạn số lượng liên kết bạn có thể thêm.",
      answerEn: "You can add many social links like Instagram, Discord, Facebook, Twitter, YouTube, TikTok, etc. There is no limit to the number of links you can add.",
      icon: "bi-link-45deg",
    },
    {
      id: 8,
      questionVi: "Làm thế nào để thay đổi layout của profile?",
      questionEn: "How do I change my profile layout?",
      answerVi: "Vào Dashboard → Home → Style Settings → Layout. Bạn có thể chọn từ các layout có sẵn như 'Link in Bio' (centered) hoặc 'Side Profile' (left-aligned). Mỗi layout có thể được tùy chỉnh thêm.",
      answerEn: "Go to Dashboard → Home → Style Settings → Layout. You can choose from available layouts like 'Link in Bio' (centered) or 'Side Profile' (left-aligned). Each layout can be further customized.",
      icon: "bi-layout-text-window",
    },
    {
      id: 9,
      questionVi: "Tôi có thể tùy chỉnh cursor không?",
      questionEn: "Can I customize my cursor?",
      answerVi: "Có! Vào Style Settings → Cursor, bạn có thể chọn loại cursor (circle, square, custom), màu sắc, kích thước, scale, và thậm chí upload cursor tùy chỉnh của riêng bạn.",
      answerEn: "Yes! Go to Style Settings → Cursor, you can choose cursor type (circle, square, custom), color, size, scale, and even upload your own custom cursor.",
      icon: "bi-cursor",
    },
    {
      id: 10,
      questionVi: "Làm thế nào để reset style về mặc định?",
      questionEn: "How do I reset styles to default?",
      answerVi: "Trong mỗi phần style settings, bạn sẽ thấy nút 'Reset' để đưa các thiết lập về giá trị mặc định. Ví dụ, trong Container settings có nút Reset để reset tất cả các thuộc tính container.",
      answerEn: "In each style settings section, you will see a 'Reset' button to restore settings to default values. For example, in Container settings there is a Reset button to reset all container properties.",
      icon: "bi-arrow-counterclockwise",
    },
    {
      id: 11,
      questionVi: "Tôi có thể thêm audio vào profile không?",
      questionEn: "Can I add audio to my profile?",
      answerVi: "Có! Vào Style Settings → Audio, bạn có thể upload file audio và nó sẽ được phát tự động khi người dùng truy cập profile của bạn. Bạn cũng có thể tùy chỉnh các thuộc tính audio như autoplay, loop, volume.",
      answerEn: "Yes! Go to Style Settings → Audio, you can upload an audio file and it will play automatically when users visit your profile. You can also customize audio properties like autoplay, loop, volume.",
      icon: "bi-music-note-beamed",
    },
    {
      id: 12,
      questionVi: "Làm thế nào để ủng hộ dự án?",
      questionEn: "How can I support the project?",
      answerVi: "Bạn có thể ủng hộ Mecha bằng cách vào Dashboard → Account → Donate. Chúng tôi chấp nhận chuyển khoản qua MB Bank. Mọi sự ủng hộ đều được đánh giá cao và giúp chúng tôi phát triển thêm nhiều tính năng mới!",
      answerEn: "You can support Mecha by going to Dashboard → Account → Donate. We accept bank transfers via MB Bank. All support is greatly appreciated and helps us develop more new features!",
      icon: "bi-heart",
    },
    {
      id: 13,
      questionVi: "Tài khoản của tôi có bị mất không?",
      questionEn: "Will I lose my account?",
      answerVi: "Không, dữ liệu của bạn được lưu trữ an toàn trên server. Tuy nhiên, bạn nên đảm bảo đã liên kết tài khoản với Discord để có thể đăng nhập lại dễ dàng.",
      answerEn: "No, your data is safely stored on the server. However, you should ensure your account is linked with Discord so you can easily log in again.",
      icon: "bi-shield-check",
    },
    {
      id: 14,
      questionVi: "Tôi gặp lỗi khi đăng nhập bằng Discord, phải làm sao?",
      questionEn: "I'm having trouble logging in with Discord, what should I do?",
      answerVi: "Nếu bạn gặp lỗi khi đăng nhập bằng Discord, vui lòng liên hệ hỗ trợ qua Discord server của chúng tôi để được hỗ trợ nhanh chóng.",
      answerEn: "If you encounter errors when logging in with Discord, please contact support through our Discord server for quick assistance.",
      icon: "bi-exclamation-triangle",
    },
    {
      id: 15,
      questionVi: "Có giới hạn về kích thước file upload không?",
      questionEn: "Are there file size limits for uploads?",
      answerVi: "Có, mỗi loại file có giới hạn riêng. Avatar thường giới hạn khoảng 5MB, background image/video có thể lớn hơn. Audio file cũng có giới hạn. Hệ thống sẽ thông báo nếu file của bạn vượt quá giới hạn.",
      answerEn: "Yes, each file type has its own limit. Avatars are typically limited to around 5MB, background images/videos can be larger. Audio files also have limits. The system will notify you if your file exceeds the limit.",
      icon: "bi-file-earmark",
    },
    {
      id: 16,
      questionVi: "Làm thế nào để kiếm Coins miễn phí?",
      questionEn: "How can I earn Coins for free?",
      answerVi: "Bạn có thể kiếm Coins miễn phí bằng cách tham gia Discord server của chúng tôi và chơi các trò chơi với bot Discord! Bot sẽ thưởng Coins cho các hoạt động và thành tích của bạn. Tham gia ngay để bắt đầu kiếm Coins!",
      answerEn: "You can earn free Coins by joining our Discord server and playing games with the Discord bot! The bot will reward Coins for your activities and achievements. Join now to start earning Coins!",
      icon: "bi-discord",
    },
  ];

  return (
    <section id="faq" className="w-full text-white py-20 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {language === "vi" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"}
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mt-6">
            {language === "vi" 
              ? "Tìm câu trả lời cho các câu hỏi phổ biến về Mecha"
              : "Find answers to common questions about Mecha"}
          </p>
          
          {/* Language Toggle */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setLanguage("vi")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                language === "vi"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                language === "en"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openItems.has(item.id);
            const question = language === "vi" ? item.questionVi : item.questionEn;
            const answer = language === "vi" ? item.answerVi : item.answerEn;
            
            return (
              <div
                key={item.id}
                className="bg-[#101010] border-2 border-gray-800 rounded-[15px] overflow-hidden shadow-lg hover:border-blue-500 transition-all duration-300"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-900 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <i className={`bi ${item.icon} text-2xl text-blue-400 flex-shrink-0`}></i>
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {question}
                    </h3>
                  </div>
                  <i
                    className={`bi ${
                      isOpen ? "bi-chevron-up" : "bi-chevron-down"
                    } text-blue-400 text-xl transition-transform duration-300 flex-shrink-0`}
                  ></i>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 pl-16 text-gray-300 leading-relaxed">
                    {answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-[#101010] border-2 border-gray-800 rounded-[15px] p-6 text-center">
          <i className="bi bi-envelope-heart text-3xl text-blue-400 mb-3"></i>
          <h3 className="text-xl font-semibold text-white mb-2">
            {language === "vi" 
              ? "Vẫn chưa tìm thấy câu trả lời?"
              : "Still can't find the answer?"}
          </h3>
          <p className="text-gray-200 mb-4">
            {language === "vi"
              ? "Liên hệ với chúng tôi qua Discord hoặc email để được hỗ trợ"
              : "Contact us via Discord or email for support"}
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/discord"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <i className="bi bi-discord"></i>
              <span>{language === "vi" ? "Discord Support" : "Discord Support"}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

