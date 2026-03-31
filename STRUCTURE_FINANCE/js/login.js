// Lấy các phần tử từ HTML
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

// Lắng nghe sự kiện click Đăng nhập
btnLogin.addEventListener("click", function (event) {
  event.preventDefault(); // Ngăn chặn load lại trang mặc định nếu có thẻ form

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // 1. Kiểm tra rỗng
  if (!email || !password) {
    Swal.fire({
      icon: "error",
      title: "Thiếu thông tin!",
      text: "Vui lòng nhập đầy đủ Email và Mật khẩu.",
    });
    return;
  }

  // 2. Lấy danh sách users từ localStorage một cách an toàn
  let users = [];
  try {
    const storedData = JSON.parse(localStorage.getItem("users"));
    if (Array.isArray(storedData)) {
      users = storedData;
    }
  } catch (error) {
    console.log("Không thể đọc dữ liệu users.");
  }

  // 3. Tìm kiếm người dùng có email và password khớp nhau
  const foundUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  // 4. Xử lý kết quả
  if (foundUser) {
    // Đăng nhập thành công: Lưu thông tin người dùng này vào localStorage với tên "currentUser"
    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    // Thông báo thành công tự động đóng
    Swal.fire({
      icon: "success",
      title: "Đăng nhập thành công!",
      text: "Chào mừng " + foundUser.fullName + " trở lại.",
      showConfirmButton: false,
      timer: 1500 // Tự động chuyển trang sau 1.5 giây
    }).then(() => {
      window.location.href = "index.html"; // Chuyển sang trang chủ
    });
  } else {
    // Đăng nhập thất bại (sai email hoặc mật khẩu)
    Swal.fire({
      icon: "error",
      title: "Đăng nhập thất bại!",
      text: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
    });
  }
});