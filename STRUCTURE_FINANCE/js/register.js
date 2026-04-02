// Hàm kiểm tra định dạng email bằng Regex (Nguồn: StackOverflow)
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// render các phần tử từ HTML
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const btnRegister = document.getElementById("btnRegister");

// Lắng nghe sự kiện click Đăng ký
btnRegister.addEventListener("click", function () {
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // 1. Kiểm tra rỗng thông tin đăng kkis
  if (!fullName || !email || !password || !confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Thiếu thông tin!",
      text: "Vui lòng điền đầy đủ thông tin.",
    });
    return;
  }

  // 2. Kiểm tra định dạng email theo hàm ở trên 
  if (!validateEmail(email)) {
    Swal.fire({
      icon: "error",
      title: "Email không hợp lệ!",
      text: "Vui lòng nhập đúng định dạng email (VD: abc@gmail.com).",
    });
    return;
  }

  // 3. Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    Swal.fire({
      icon: "warning",
      title: "Mật khẩu quá ngắn",
      text: "Mật khẩu phải có ít nhất 6 ký tự trở lên.",
    });
    return;
  }

  // 4. Kiểm tra mật khẩu xác nhận
  if (password !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Mật khẩu không khớp!",
      text: "Vui lòng kiểm tra lại mật khẩu xác nhận.",
    });
    return;
  }

  // --- LƯU DỮ LIỆU ---
  
  let storedData = localStorage.getItem("users");
  let users = []; 

  // Nếu kho có dữ liệu không phải là null, thì mới tiến hành đọc parse
  if (storedData !== null) {
    users = JSON.parse(storedData);
  }

  // Kiểm tra xem email đã tồn tại chưa
  const isEmailExist = users.some(function (user) {
    return user.email === email;
  });

  if (isEmailExist) {
    Swal.fire({
      icon: "error",
      title: "Email đã tồn tại!",
      text: "Vui lòng sử dụng một địa chỉ email khác.",
    });
    return;
  }

  // Tạo tài khoản mới
  const newUser = {
    id: Date.now(),
    fullName: fullName,
    email: email,
    password: password,
    phone: "",
    gender: true,
    status: true,
  };

  // Lưu vào mảng và cập nhật trong localStorage
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  Swal.fire({
    icon: "success",
    title: "Đăng ký thành công!",
    text: "Chào mừng bạn đến với hệ thống Quản lý tài chính.",
    confirmButtonText: "Đến trang Đăng nhập",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "login.html";
    }
  });
});