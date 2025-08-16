import  { useState } from "react";

// Dữ liệu mẫu
const statsData = [
  { title: "Tổng số", value: "1,248", change: 12.5, color: "blue", icon: "fas fa-arrow-up" },
  { title: "Đã hoàn thành", value: "834", change: 8.2, color: "green", icon: "fas fa-arrow-up" },
  { title: "Đang tiến hành", value: "412", change: -4.3, color: "purple", icon: "fas fa-arrow-down" },
];

const tableData = [
  { id: "#1001", name: "Sản phẩm A", type: "mới", quantity: 156, date: "15/07/2023" },
  { id: "#1002", name: "Sản phẩm B", type: "phổ biến", quantity: 289, date: "12/07/2023" },
  { id: "#1003", name: "Sản phẩm C", type: "hết hàng", quantity: 0, date: "10/07/2023" },
  { id: "#1004", name: "Sản phẩm D", type: "giảm giá", quantity: 187, date: "08/07/2023" },
  { id: "#1005", name: "Sản phẩm E", type: "ngừng kinh doanh", quantity: 42, date: "05/07/2023" },
];

const badgeColors = {
  "mới": "bg-green-100 text-green-800",
  "phổ biến": "bg-blue-100 text-blue-800",
  "hết hàng": "bg-yellow-100 text-yellow-800",
  "giảm giá": "bg-purple-100 text-purple-800",
  "ngừng kinh doanh": "bg-red-100 text-red-800",
};

export default function App() {
  const [currentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = 24;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Container chính */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Báo Cáo Thống Kê</h1>
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200 flex items-center">
              <i className="fas fa-file-export mr-2"></i>
              Xuất PDF
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-sm transition duration-200 flex items-center">
              <i className="fas fa-filter mr-2"></i>
              Lọc dữ liệu
            </button>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-lg shadow-sm border-l-4 border-${stat.color}-500`}
            >
              <div className="text-gray-500 text-sm font-medium">{stat.title}</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</div>
              <div
                className={`text-sm mt-2 flex items-center ${
                  stat.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                <i className={`${stat.icon} mr-1`}></i>
                {Math.abs(stat.change)}% từ tháng trước
              </div>
            </div>
          ))}
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Tên", "Loại", "Số lượng", "Ngày cập nhật", "Hành động"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        {header}
                        {header !== "Hành động" && (
                          <i className="fas fa-sort ml-1 text-gray-400"></i>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          badgeColors[row.type]
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-500 hover:text-blue-700 mr-3">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{startIndex}</span> đến{" "}
                  <span className="font-medium">{endIndex}</span> của{" "}
                  <span className="font-medium">{totalItems}</span> kết quả
                </p>
              </div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <i className="fas fa-chevron-left"></i>
                </a>
                {[1, 2, 3].map((page) => (
                  <a
                    key={page}
                    href="#"
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </a>
                ))}
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {totalPages}
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <i className="fas fa-chevron-right"></i>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}