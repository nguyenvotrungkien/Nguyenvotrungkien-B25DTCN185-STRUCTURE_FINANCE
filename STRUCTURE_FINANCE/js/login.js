// ==========================================
// HÀM KHỞI TẠO DỮ LIỆU MẪU TỪ ẢNH THIẾT KẾ
// ==========================================
function initSampleData() {
  // 1. Bơm dữ liệu Users 
  if (localStorage.getItem("users") === null) {
    const sampleUsers = [
      {
        id: 1,
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        password: "123456",
        phone: "0987654321",
        gender: true,
        status: true
      },
      {
        id: 2,
        fullName: "Phạm Thị B",
        email: "phamthib@gmail.com",
        password: "123456",
        phone: "0987654321",
        gender: false,
        status: true
      }
    ];
    localStorage.setItem("users", JSON.stringify(sampleUsers));
  }

  // 2. Bơm dữ liệu Categories 
  if (localStorage.getItem("categories") === null) {
    const sampleCategories = [
      { id: 1, name: "Tiền đi học", imageUrl: "đường dẫn ảnh", status: true },
      { id: 2, name: "Tiền đi chơi", imageUrl: "đường dẫn ảnh", status: false }
    ];
    localStorage.setItem("categories", JSON.stringify(sampleCategories));
  }

  // 3. Bơm dữ liệu MonthlyCategories 
  if (localStorage.getItem("monthlyCategories") === null) {
    const sampleMonthlyCategories = [
      {
        id: 1,
        month: "2025-09", 
        categories: [
          { id: 1, categoryId: 1, budget: 300000 },
          { id: 2, categoryId: 2, budget: 500000 }
        ]
      }
    ];
    localStorage.setItem("monthlyCategories", JSON.stringify(sampleMonthlyCategories));
  }

  // 4. Bơm dữ liệu Transactions 
  if (localStorage.getItem("transactions") === null) {
    const sampleTransactions = [
      {
        id: 1,
        createdDate: "2025-10-01",
        total: 150000,
        description: "Tiền đi chơi",
        categoryId: 1,
        monthlyCategoryId: 1
      }
    ];
    localStorage.setItem("transactions", JSON.stringify(sampleTransactions));
  }
}

// Gọi hàm này ngay lập tức khi file JS được nạp
initSampleData();
// Lấy các phần tử từ HTML
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

// Lắng nghe sự kiện click Đăng nhập, Ngăn chặn load lại trang mặc định nếu có thẻ form
btnLogin.addEventListener("click", function (event) {
  event.preventDefault(); 

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // 1. Kiểm tra rỗng thôgn tin
  if (!email || !password) {
    Swal.fire({
      icon: "error",
      title: "Thiếu thông tin!",
      text: "Vui lòng nhập đầy đủ Email và Mật khẩu.",
    });
    return;
  }

  // 2. Lấy danh sách users từ localStorage 
  let storedData = localStorage.getItem("users");
  let users = [];

  if (storedData !== null) {
    users = JSON.parse(storedData);
  }

  // 3. Tìm kiếm người dùng có email và password trungf nhau
  const foundUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  // 4. Xử lý kết quả
  if (foundUser) {
    // Đăng nhập thành công: Lưu thông tin người dùng này vào localStorage  "currentUser"
    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    Swal.fire({
      icon: "success",
      title: "Đăng nhập thành công!",
      text: "Chào mừng " + foundUser.fullName + " trở lại.",
      showConfirmButton: false,
      timer: 2000 
    }).then(() => {
      window.location.href = "index.html"; 
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Đăng nhập thất bại!",
      text: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
    });
  }
});