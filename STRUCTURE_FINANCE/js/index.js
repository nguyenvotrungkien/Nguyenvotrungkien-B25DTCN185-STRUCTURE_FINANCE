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
    remainingMoney.innerText = "0 VND";
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
  const budgetAmount = Number(budgetInput.value);

  // Kiểm tra lỗi nhập liệu
  if (!selectedMonth) {
    Swal.fire({
      icon: "error",
      title: "Chưa chọn tháng",
      text: "Vui lòng nhập tháng để tiếp tục",
    });
    return;
  }

  if (budgetAmount <= 0 || isNaN(budgetAmount)) {
    Swal.fire({
      icon: "error",
      title: "Số tiền không hợp lệ",
      text: "Vui lòng, số tiền phải lớn hơn 0",
    });
    return;
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
      amount: budgetAmount,
    };
    budgets.push(newBudget);
  }

  // Lưu mảng đã cập nhật ngược lại vào localStorage
  localStorage.setItem("budgets", JSON.stringify(budgets));

  // Thông báo THÀNH CÔNG (Tự động ẩn sau 1.5 giây, không cần ai bấm)
  Swal.fire({
    icon: "success",
    title: "Đã lưu ngân sách!",
    text:
      "Ngân sách tháng " + selectedMonth + " là: " + formatMoney(budgetAmount),
    showConfirmButton: false,
    timer: 3000,
  });

  // Gọi lại hàm load để cập nhật số tiền xanh lá cây lên màn hình
  loadMonthData();
});
// ==========================================
// 6. QUẢN LÝ DANH MỤC VÀ HẠN MỨC
// ==========================================

const catNameInput = document.getElementById("catNameInput");
const catBudgetInput = document.getElementById("catBudgetInput");
const btnAddCategory = document.getElementById("btnAddCategory");
const categoryList = document.getElementById("categoryList");

const getCategories = function () {
  let storedData = localStorage.getItem("categories");
  if (storedData !== null) return JSON.parse(storedData);
  return [];
};

const getMonthlyCategories = function () {
  let storedData = localStorage.getItem("monthlyCategories");
  if (storedData !== null) return JSON.parse(storedData);
  return [];
};

// --- HÀM 1: VẼ DANH SÁCH RA MÀN HÌNH ---
const renderCategories = function () {
  categoryList.innerHTML = "";

  const categories = getCategories();
  const monthlyCategories = getMonthlyCategories();
  const selectedMonth = monthInput.value;

  const currentMonthData = monthlyCategories.find(function (m) {
    return m.month === selectedMonth;
  });

  categories.forEach(function (cat) {
    let budgetText = "Chưa thiết lập";
    let rawBudget = 0;

    if (currentMonthData) {
      const budgetDetail = currentMonthData.categories.find(function (b) {
        return b.categoryId === cat.id;
      });
      if (budgetDetail) {
        budgetText = formatMoney(budgetDetail.budget);
        rawBudget = budgetDetail.budget;
      }
    }

    const li = document.createElement("li");
    li.className = "category-item";
    li.innerHTML = `
      <span>${cat.name} - Giới hạn: <span style="color: #3b82f6">${budgetText}</span></span>
      <div class="category-actions">
        <button class="btn red" onclick="editCategory(${cat.id}, '${cat.name}', ${rawBudget})">Sửa</button>
        <button class="btn red" onclick="deleteCategory(${cat.id})">Xóa</button>
      </div>
    `;

    categoryList.appendChild(li);
  });
};

// --- HÀM 2: LƯU DANH MỤC MỚI (VÀ LƯU SỬA) ---
btnAddCategory.addEventListener("click", function () {
  const catName = catNameInput.value.trim();
  const catBudget = Number(catBudgetInput.value);
  const selectedMonth = monthInput.value;

  if (!selectedMonth || !catName || catBudget <= 0 || isNaN(catBudget)) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Vui lòng nhập đầy đủ và hợp lệ!",
    });
    return;
  }

  let categories = getCategories();
  let foundCat = categories.find(
    (c) => c.name.toLowerCase() === catName.toLowerCase(),
  );
  let categoryIdToSave;

  if (!foundCat) {
    categoryIdToSave = Date.now();
    categories.push({
      id: categoryIdToSave,
      name: catName,
      imageUrl: "",
      status: true,
    });
    localStorage.setItem("categories", JSON.stringify(categories));
  } else {
    categoryIdToSave = foundCat.id;
  }

  let monthlyCategories = getMonthlyCategories();
  let currentMonthData = monthlyCategories.find(
    (m) => m.month === selectedMonth,
  );

  if (!currentMonthData) {
    currentMonthData = {
      id: Date.now(),
      month: selectedMonth,
      categories: [
        { id: Date.now(), categoryId: categoryIdToSave, budget: catBudget },
      ],
    };
    monthlyCategories.push(currentMonthData);
  } else {
    let budgetIndex = currentMonthData.categories.findIndex(
      (b) => b.categoryId === categoryIdToSave,
    );
    if (budgetIndex !== -1) {
      currentMonthData.categories[budgetIndex].budget = catBudget;
    } else {
      currentMonthData.categories.push({
        id: Date.now(),
        categoryId: categoryIdToSave,
        budget: catBudget,
      });
    }
  }

  localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories));

  // Reset lại ô nhập liệu
  catNameInput.value = "";
  catBudgetInput.value = "";

  // TRẢ NÚT VỀ TRẠNG THÁI GỐC "THÊM DANH MỤC"
  btnAddCategory.innerText = "Thêm danh mục";

  renderCategories();
});

// --- HÀM 3: XỬ LÝ NÚT SỬA MÀU ĐỎ Ở DANH SÁCH ---
window.editCategory = function (id, name, budget) {
  catNameInput.value = name;
  if (budget > 0) {
    catBudgetInput.value = budget;
  } else {
    catBudgetInput.value = "";
  }

  catNameInput.focus();

  // ĐỔI CHỮ NÚT THÀNH "SỬA DANH MỤC" KHI BẤM VÀO ĐÂY
  btnAddCategory.innerText = "Sửa danh mục";
};

// --- HÀM 4: XÓA DANH MỤC ---
window.deleteCategory = async function (id) {
  const result = await Swal.fire({
    title: "Xóa danh mục?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Đồng ý xóa",
    cancelButtonText: "Hủy",
  });

  if (result.isConfirmed === true) {
    let categories = getCategories();
    categories = categories.filter((cat) => cat.id !== id);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
  }
};

// --- KÍCH HOẠT KHI MỞ TRANG ---
monthInput.addEventListener("change", renderCategories);
renderCategories();
