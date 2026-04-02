// 1. KIỂM TRA ĐĂNG NHẬP
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// kiểm tra nếu chưa đăng nhập sẽ phải đăng nhập
if (!currentUser) {
  alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để sử dụng hệ thống.");
  window.location.href = "login.html";
} else {
  // nếu đăng nhập sẽ hiện tên thay vì tài khoản
  document.getElementById("userNameDisplay").innerText = currentUser.fullName;
}

// 2. ẩn hiện menu
const accountBtn = document.getElementById("accountBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

accountBtn.addEventListener("click", function () {
dropdownMenu.classList.toggle("show");
});

// 3. bảng thông tin cá nhân
const btnProfile = document.getElementById("btnProfile");
btnProfile.addEventListener("click", function (event) {
  event.preventDefault();
  dropdownMenu.classList.remove("show"); 

  Swal.fire({
    title: "Thông Tin Chủ Nhân",
    html: `
      <div style="text-align: left; font-size: 16px; line-height: 1.8;">
        <p><b>Họ và tên:</b> ${currentUser.fullName}</p>
        <p><b>Email:</b> ${currentUser.email}</p>
        <br>
        <hr>
        <br>
        <p style="color: green;"><i> Chúc Chủ Nhân ${currentUser.fullName} một ngày tốt lành 🍀 </i></p>
      </div>
    `,
    icon: "info",
    confirmButtonText: "Đóng",
  });
});

// 4. nút đăng xuất
const btnLogout = document.getElementById("btnLogout");
btnLogout.addEventListener("click", function (event) {
  event.preventDefault();
  dropdownMenu.classList.remove("show");

  Swal.fire({
    title: "Xác nhận đăng xuất",
    text: "Bạn có chắc chắn muốn thoát khỏi ứng dụng?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý, Đăng xuất!",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser"); 
      window.location.href = "login.html"; 
    }
  });
});
// ==========================================
// 5. XỬ LÝ CHỌN THÁNG VÀ LƯU NGÂN SÁCH
// ==========================================

// Lấy các phần tử bằng ID em vừa đặt bên HTML
const monthInput = document.getElementById("monthInput");
const budgetInput = document.getElementById("budgetInput");
const btnSaveBudget = document.getElementById("btnSaveBudget");
const remainingMoney = document.getElementById("remainingMoney");

// Hàm định dạng tiền tệ (VD: Biến 5000000 thành "5.000.000 VND")
const formatMoney = function (amount) {
  return amount.toLocaleString("vi-VN") + " VND";
};

// Hàm lấy danh sách ngân sách từ localStorage an toàn (dùng if...else)
const getBudgets = function () {
  let storedData = localStorage.getItem("budgets");
  let budgets = [];
  if (storedData !== null) {
    budgets = JSON.parse(storedData);
  }
  return budgets;
};

// Hàm hiển thị dữ liệu lên màn hình khi chọn 1 tháng
const loadMonthData = function () {
  const selectedMonth = monthInput.value;
  if (!selectedMonth) return;

  const budgets = getBudgets();
  
  // Tìm xem người dùng đang đăng nhập (currentUser) đã lưu ngân sách cho tháng này chưa
  const currentBudget = budgets.find(function (item) {
    return item.email === currentUser.email && item.month === selectedMonth;
  });

  if (currentBudget) {
    // Nếu có rồi thì điền lại số tiền vào ô input và hiển thị số dư
    budgetInput.value = currentBudget.amount;
    remainingMoney.innerText = formatMoney(currentBudget.amount);
    remainingMoney.style.color = "green";
  } else {
    // Nếu chưa có thì xóa trắng ô input, đưa số dư về 0
    budgetInput.value = "";
    remainingMoney.innerText = "0 ₫";
    remainingMoney.style.color = "black";
  }
};

// Hàm tự động đặt tháng mặc định là tháng hiện tại khi vừa mở web
const setDefaultMonth = function () {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1; // Trong JS, tháng bắt đầu từ 0 nên phải cộng 1
  
  // Thêm số 0 đằng trước nếu là các tháng 1-9 (để ra định dạng chuẩn YYYY-MM)
  if (month < 10) {
    month = "0" + month;
  }

  monthInput.value = year + "-" + month;
  
  // Sau khi set ngày xong thì gọi hàm load dữ liệu luôn
  loadMonthData();
};

// --- LẮNG NGHE SỰ KIỆN ---

// 1. Khi người dùng bấm chọn tháng khác -> Tự động load lại dữ liệu tháng đó
monthInput.addEventListener("change", loadMonthData);

// 2. Khi người dùng nhập tiền và bấm nút "Lưu"
btnSaveBudget.addEventListener("click", function () {
  const selectedMonth = monthInput.value;
  const budgetAmount = Number(budgetInput.value); // Chuyển chữ thành số

  // Kiểm tra lỗi nhập liệu (Dùng SweetAlert2)
  if (!selectedMonth) {
    Swal.fire({ 
      icon: "error", 
      title: "Chưa chọn tháng", 
      text: "Không chọn tháng thì sao mà lưu ???" 
    });
    return; // Dừng lại luôn
  }

  if (budgetAmount <= 0 || isNaN(budgetAmount)) {
    Swal.fire({ 
      icon: "error", 
      title: "Số tiền không hợp lệ", 
      text: "không có tiền thì nhập làm gì" 
    });
    return; // Dừng lại luôn
  }

  let budgets = getBudgets();

  // Tìm xem tháng này đã có trong mảng chưa
  const existingIndex = budgets.findIndex(function (item) {
    return item.email === currentUser.email && item.month === selectedMonth;
  });

  if (existingIndex !== -1) {
    // NẾU CÓ RỒI: Cập nhật lại số tiền (Sửa)
    budgets[existingIndex].amount = budgetAmount;
  } else {
    // NẾU CHƯA CÓ: Thêm một bản ghi mới vào mảng (Thêm mới)
    const newBudget = {
      email: currentUser.email,
      month: selectedMonth,
      amount: budgetAmount
    };
    budgets.push(newBudget);
  }

  // Lưu mảng đã cập nhật ngược lại vào localStorage
  localStorage.setItem("budgets", JSON.stringify(budgets));
  
  // Thông báo THÀNH CÔNG (Tự động ẩn sau 1.5 giây, không cần ai bấm)
  Swal.fire({
    icon: "success",
    title: "Đã lưu ngân sách!",
    text: "Ngân sách tháng " + selectedMonth + " là: " + formatMoney(budgetAmount),
    showConfirmButton: false,
    timer: 1500
  });
  
  // Gọi lại hàm load để cập nhật số tiền xanh lá cây lên màn hình
  loadMonthData();
});