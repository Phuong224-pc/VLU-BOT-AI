// document.addEventListener('DOMContentLoaded', () => {
//     const modal = document.getElementById('authModal');
//     const guestBtn = document.getElementById('guestBtn');
//     const closeBtn = document.querySelector('.close-modal');
//     const loginTabBtn = document.getElementById('loginTabBtn');
//     const registerTabBtn = document.getElementById('registerTabBtn');
//     const loginForm = document.getElementById('loginForm');
//     const registerForm = document.getElementById('registerForm');
//     const userDropdown = document.getElementById('userDropdown');
//     const logoutBtn = document.getElementById('logoutBtn');

//     if (guestBtn) {
//         guestBtn.onclick = (e) => {
//             e.stopPropagation(); // Ngăn sự kiện click bị lan ra ngoài
//             const currentUser = firebase.auth().currentUser;

//             if (currentUser) {
//                 // Nếu đã đăng nhập: Bấm vào sẽ ẩn/hiện cái Menu Dropdown nhỏ ở dưới
//                 if (userDropdown) {
//                     userDropdown.style.display = userDropdown.style.display === "none" ? "block" : "none";
//                 }
//             } else {
//                 // Nếu chưa đăng nhập: Bấm vào mở Modal như bình thường
//                 if (modal) modal.style.display = "block";
//             }
//         };
//     }

//     // Xử lý khi nhấn thực hiện hành động Đăng xuất
//     if (logoutBtn) {
//         logoutBtn.onclick = () => {
//             firebase.auth().signOut().then(() => {
//                 alert("Đã đăng xuất thành công!");
//                 if (userDropdown) userDropdown.style.display = "none";
//                 guestBtn.innerHTML = `<i class="fas fa-user-circle"></i> Đăng nhập`;
//                 guestBtn.style.background = "";

//                 const adminModule = document.getElementById('adminModule');
//                 if (adminModule) adminModule.style.display = 'none';
//             }).catch((error) => {
//                 console.error("Lỗi đăng xuất:", error);
//             });
//         };
//     }

//     if (closeBtn) {
//         closeBtn.onclick = () => {
//             if (modal) modal.style.display = "none";
//         };
//     }

//     // Click ra ngoài bất kỳ đâu trên màn hình thì tự động đóng khép các menu lại
//     window.addEventListener('click', (e) => {
//         if (modal && e.target === modal) {
//             modal.style.display = "none";
//         }
//         if (userDropdown && !guestBtn.contains(e.target)) {
//             userDropdown.style.display = "none";
//         }
//     });

//     loginTabBtn.onclick = () => {
//         loginForm.style.display = "flex";
//         registerForm.style.display = "none";
//         loginTabBtn.classList.add('active');
//         registerTabBtn.classList.remove('active');
//     };

//     registerTabBtn.onclick = () => {
//         loginForm.style.display = "none";
//         registerForm.style.display = "flex";
//         registerTabBtn.classList.add('active');
//         loginTabBtn.classList.remove('active');
//     };

//     function handleAuthSuccess(user) {
//         if (modal) modal.style.display = "none";

//         // Hiển thị tên user hoặc cắt chuỗi lấy tên trước chữ @ của email
//         guestBtn.innerHTML = `<i class="fas fa-user-check"></i> ${user.displayName || user.email.split('@')[0]}`;
//         guestBtn.style.background = "#28a745";
//         guestBtn.title = "Bấm vào đây để đăng xuất"; // Gợi ý cho người dùng

//         const adminEmail = "ngocduyprc2006@gmail.com";
//         if (user.email === adminEmail) {
//             const adminModule = document.getElementById('adminModule');
//             if (adminModule) {
//                 adminModule.style.display = 'block';
//             }
//         }
//     }

//     function loginWithGoogle() {
//         const provider = new firebase.auth.GoogleAuthProvider();
//         firebase.auth().signInWithPopup(provider)
//             .then((result) => {
//                 const user = result.user;
//                 const adminEmail = "duy.2474802010071@vanlanguni.vn";

//                 if (user.email === adminEmail) {
//                     handleAuthSuccess(user);
//                     return;
//                 }

//                 firebase.auth().fetchSignInMethodsForEmail(user.email)
//                     .then((methods) => {
//                         if (methods.length === 0) {
//                             alert("Tài khoản Google này chưa được đăng ký trên hệ thống! Vui lòng chuyển sang tab Đăng ký trước.");
//                             firebase.auth().signOut().then(() => {
//                                 guestBtn.innerHTML = `<i class="fas fa-user-circle"></i> Đăng nhập`;
//                                 guestBtn.style.background = "";
//                             });
//                         } else {
//                             handleAuthSuccess(user);
//                         }
//                     });
//             })
//             .catch((error) => {
//                 console.error("Lỗi đăng nhập Google:", error);
//                 alert("Đăng nhập bằng Google thất bại!");
//             });
//     }

//     function loginWithFacebook() {
//         const provider = new firebase.auth.FacebookAuthProvider();
//         firebase.auth().signInWithPopup(provider)
//             .then((result) => {
//                 handleAuthSuccess(result.user);
//             })
//             .catch((error) => {
//                 console.error("Lỗi đăng nhập Facebook:", error);
//                 alert("Đăng nhập bằng Facebook thất bại!");
//             });
//     }

//     // XỬ LÝ FORM ĐĂNG KÝ THỦ CÔNG CHUẨN ĐỊNH DẠNG EMAIL
//     registerForm.onsubmit = (e) => {
//         e.preventDefault();
//         // Lấy nguyên văn email người ta nhập (không tự động nối đuôi @vanlanguni.vn nữa)
//         let emailInput = document.getElementById('regEmail').value.trim();
//         const pass = document.getElementById('regPass').value;
//         const confirm = document.getElementById('regPassConfirm').value;

//         if (!emailInput) {
//             alert("Vui lòng điền địa chỉ Email!");
//             return;
//         }

//         // Kiểm tra định dạng email cơ bản để tránh user nhập bậy
//         if (!emailInput.includes("@")) {
//             alert("Vui lòng nhập đúng định dạng Email (Ví dụ: abc@gmail.com)!");
//             return;
//         }

//         if (pass.includes(" ")) {
//             alert("Mật khẩu không được chứa khoảng trắng!");
//             return;
//         }
//         if (pass !== confirm) {
//             alert("Mật khẩu nhập lại không khớp!");
//             return;
//         }

//         firebase.auth().createUserWithEmailAndPassword(emailInput, pass)
//             .then(() => {
//                 alert("Đăng ký thành công! Mời bạn đăng nhập.");
//                 loginTabBtn.click();
//                 if (document.getElementById('loginUser')) {
//                     document.getElementById('loginUser').value = emailInput;
//                 }
//             })
//             .catch((error) => {
//                 console.error("Lỗi đăng ký:", error);
//                 alert("Đăng ký thất bại: " + error.message);
//             });
//     };

//     // XỬ LÝ FORM ĐĂNG NHẬP THỦ CÔNG CHUẨN ĐỊNH DẠNG EMAIL
//     loginForm.onsubmit = (e) => {
//         e.preventDefault();
//         let emailInput = document.getElementById('loginUser').value.trim();
//         const passInput = document.getElementById('loginPass');
//         const pass = passInput ? passInput.value : "";

//         if (!emailInput) {
//             alert("Vui lòng nhập tài khoản đăng nhập!");
//             return;
//         }

//         // Tự động nhận diện và sửa lỗi thiếu định dạng email
//         if (!emailInput.includes("@")) {
//             emailInput = emailInput + "@vanlanguni.vn";
//         }

//         firebase.auth().signInWithEmailAndPassword(emailInput, pass)
//             .then((result) => {
//                 handleAuthSuccess(result.user);
//             })
//             .catch((error) => {
//                 console.error("Lỗi đăng nhập:", error);
//                 alert("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản và mật khẩu.");
//             });
//     };

//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//             handleAuthSuccess(user);
//         }
//     });

//     window.vluAuthActions = {
//         loginWithGoogle,
//         loginWithFacebook
//     };
// });