document.addEventListener('DOMContentLoaded', function () {
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var checkBtn = document.getElementById('checkBtn');
    var loginBtn = document.getElementById('loginBtn');
    var exitBtn = document.getElementById('exitBtn');

    var messageDisplay = document.getElementById('messageDisplay');
    var loginContainer = document.querySelector('.login-container');
    var dashboard = document.getElementById('dashboard');
    var userDisplay = document.getElementById('userDisplay');
    var user = document.querySelector('.user');
    
    

    var defaultUsers = {
    sahaf: "0918_SAhaf",
    tadam: "Tadam__0918"
    };

    // load saved users (updated passwords) if available
    var users = JSON.parse(localStorage.getItem("usersDB")) || defaultUsers;

    // helper to save updates
    function saveUsers() {
    localStorage.setItem("usersDB", JSON.stringify(users));
    }
    var currentUser = "";

    // show/hide 
    checkBtn.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            checkBtn.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            checkBtn.textContent = 'Check';
        }
    });

    // login
    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();

        var username = usernameInput.value.trim();
        var pass = passwordInput.value;

        if (username === '' || pass === '') {
            showMessage('Please enter both username and password.', 'error');
            return;
        }

        // check credentials using users object
        if (users[username] && users[username] === pass) {
            showMessage('Login Successful!', 'success');
            currentUser = username;
            showDashboard(username);
        } else {
            showMessage('Login Failed: Invalid credentials.', 'error');
        }
    });

    // exit
    exitBtn.addEventListener('click', function () {
        var sure = confirm('Are you sure you want to exit?');
        if (!sure) return;

        alert("Press Ctrl + W to close the page.");
        document.body.innerHTML =
            '<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background:#111;color:#fff;font-family:sans-serif;">' +
            '<h1>Application Exited</h1><h3>Press Ctrl + W to close the page.</h3></div>';

        //window.close();
    });

    function showMessage(msg, type) {
        messageDisplay.textContent = msg;
        messageDisplay.className = 'message ' + type;
        messageDisplay.style.opacity = '1';
        if (type === "success") {
            setTimeout(function () {
                messageDisplay.style.opacity = '0';
            }, 3000);
        }
    }

    function showDashboard(username) {
        loginContainer.style.display = 'none';
        dashboard.style.display = 'flex';
        userDisplay.textContent = username;
        user.textContent = username;
    }

    // ===== SETTINGS + DROPDOWN =====
    var settingsBtn = document.getElementById('settingsBtn');
    var settingsDropdown = document.getElementById('settingsDropdown');
    var changePassBtn = document.querySelector('.changePassBtn'); // <a>

    settingsBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        settingsDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function () {
        settingsDropdown.classList.remove('show');
    });

    // ===== CHANGE PASSWORD MODAL =====
    var changePassModal = document.getElementById('changePasswordModal');
    var closeModal = document.getElementById('closeModal');
    var changePassForm = document.getElementById('changePasswordForm');
    var passMssge = document.getElementById('passwordMessage');

    // OPEN MODAL when clicking "Change Password"
    changePassBtn.addEventListener('click', function (e) {
        e.preventDefault();
        settingsDropdown.classList.remove('show');
        changePassModal.classList.add('show-modal');

        document.getElementById('oldPassword').value = "";
        document.getElementById('newPassword').value = "";
        document.getElementById('confirmPassword').value = "";
        passMssge.style.opacity = '0';
    });

    closeModal.addEventListener('click', function () {
        changePassModal.classList.remove('show-modal');
    });

    window.addEventListener('click', function (e) {
        if (e.target === changePassModal) {
            changePassModal.classList.remove('show-modal');
        }
    });

    //dasdasdasdasdasdasdtiowutoi4uh6io34j6hpi42
    changePassForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var oldpass = document.getElementById('oldPassword').value;
        var newpass = document.getElementById('newPassword').value;
        var confirmpass = document.getElementById('confirmPassword').value;

        if (!currentUser) {
            showPasswordMessage("No logged-in user.", "error");
            return;
        }

        if (oldpass !== users[currentUser]) {
            showPasswordMessage("Old password is incorrect.", "error");
            return;
        }

        if (!validPass(newpass)) {
            showPasswordMessage("New password must be 8+ chars with uppercase, lowercase, and special character.", "error");
            return;
        }

        if (newpass !== confirmpass) {
            showPasswordMessage("New password and confirm password do not match.", "error");
            return;
        }

        users[currentUser] = newpass;
        saveUsers(); //  persist update
        showPasswordMessage("Password changed successfully!", "success");

        setTimeout(function () {
            changePassModal.classList.remove('show-modal');
        }, 1500);
    });

    function validPass(p) {
        if (p.length < 8) return false;
        if (!/[a-z]/.test(p)) return false;
        if (!/[A-Z]/.test(p)) return false;
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)) return false;
        return true;
    }

    function showPasswordMessage(msg, type) {
        passMssge.textContent = msg;
        passMssge.className = 'message ' + type; 
        passMssge.style.opacity = '1';
    }
});