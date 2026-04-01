// 1. KIỂM TRA ĐĂNG NHẬP (BẢO VỆ TRANG)
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Nếu không có ai đăng nhập (chưa có currentUser trong localStorage)
if (!currentUser) {
  alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để sử dụng hệ thống.");
  window.location.href = "login.html";
} else {
  // Nếu đã đăng nhập, thay chữ "Tài khoản" bằng Tên của người dùng
  document.getElementById("userNameDisplay").innerText = currentUser.fullName;
}

// 2. XỬ LÝ ẨN/HIỆN MENU DROPDOWN
const accountBtn = document.getElementById("accountBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

// Bấm vào nút thì bật/tắt class "show" của menu
accountBtn.addEventListener("click", function (event) {
  event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
  dropdownMenu.classList.toggle("show");
});

// Bấm ra ngoài khoảng trắng thì tự động đóng menu lại
window.addEventListener("click", function (event) {
  if (!accountBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove("show");
  }
});

// 3. XỬ LÝ NÚT "THÔNG TIN CÁ NHÂN"
const btnProfile = document.getElementById("btnProfile");
btnProfile.addEventListener("click", function (event) {
  event.preventDefault();
  dropdownMenu.classList.remove("show"); // Tắt menu đi cho gọn

  // Hiện popup thông tin
  Swal.fire({
    title: "Thông Tin Cá Nhân",
    html: `
      <div style="text-align: left; font-size: 16px; line-height: 1.8;">
        <p><b>Họ và tên:</b> ${currentUser.fullName}</p>
        <p><b>Email:</b> ${currentUser.email}</p>
        <br>
        <hr>
        <br>
        <p style="color: green;"><i> Chúc ${currentUser.fullName} một ngày tốt lành 🍀 </i></p>
      </div>
    `,
    icon: "info",
    confirmButtonText: "Đóng",
  });
});

// 4. XỬ LÝ NÚT "ĐĂNG XUẤT"
const btnLogout = document.getElementById("btnLogout");
btnLogout.addEventListener("click", function (event) {
  event.preventDefault();
  dropdownMenu.classList.remove("show");

  // Hiển thị xác nhận xem người dùng có muốn đăng xuất khỏi trang không?
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
    // Khi thực hiện chức năng logout thành công thì chuyển về trang đăng nhập
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser"); // Xóa bằng chứng đăng nhập
      window.location.href = "login.html"; // Đá về trang login
    }
  });
});