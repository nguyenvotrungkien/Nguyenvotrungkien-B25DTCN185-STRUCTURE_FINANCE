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