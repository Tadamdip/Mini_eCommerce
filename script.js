//STEP 12 KA taman
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

    var showCreateBtn = document.getElementById('showCreateBtn');
    var createAccountSection = document.getElementById('createAccountSection');
    var backToLoginBtn = document.getElementById('backToLoginBtn');
    var createAccountForm = document.getElementById('createAccountForm');

    let users = [];
    var currentUser = null;

    async function loadUsers() {
        try {
            const response = await fetch("api/load_users.php");
            users = await response.json();
            console.log("users Loaded:", users);
        } catch (error) {
            console.error("failed to load users:", error);
        }
    }
    loadUsers();

    async function saveUsersToFile() {
        try {
            const response = await fetch("api/save_users.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(users)
            });
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error("Faile to save users:", users);
            return false;
        }
    }

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

        const foundUser = users.find(user => user.username === username && user.password === pass);

        if (foundUser) {
            showMessage('Login Successfull', 'success');
            currentUser = foundUser;
            showDashboard(foundUser);
        } else {
            showMessage("Login Failed: Invalid credentials.", "error");
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

    //Create Button
    showCreateBtn.addEventListener('click', function () {
        loginContainer.style.display = 'none';
        dashboard.style.display = 'none';
        createAccountSection.style.display = 'block';
    });

    //Back to Login button
    backToLoginBtn.addEventListener('click', function () {
        createAccountSection.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    //to handle create Account
    createAccountForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const middleName = document.getElementById('middleName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const address = document.getElementById('address').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value;

        if (!firstName || !lastName || !address || !email || !username || !password) {
            showMessage("Please complete all the forms.", 'error');
            return;
        }

        const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            showMessage("Username already exists.", 'error');
            return;
        }

        const newUser = { firstName, middleName, lastName, address, email, username, password };

        users.push(newUser);

        const saved = await saveUsersToFile();
        if (saved) {
            showMessage("User account created successfully.", 'success');
            createAccountForm.reset();
        } else {
            showMessage("Failed to save user.", 'error');
        }
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

    function showDashboard(userObj) {
        loginContainer.style.display = 'none';

        const createAccountSection = document.getElementById('createAccountSection');
        if (createAccountSection) {
            createAccountSection.style.display = 'none';
        }
        dashboard.style.display = 'flex';
        document.getElementById('firstNameDisplay').textContent = userObj.firstName;
        document.getElementById('profileFirstName').textContent = userObj.firstName;
        document.querySelector('.user').textContent = userObj.username;
        document.getElementById('profileMiddleName').textContent = userObj.middleName;
        document.getElementById('profileLastName').textContent = userObj.lastName;
        document.getElementById('profileAddress').textContent = userObj.address;
        document.getElementById('profileEmail').textContent = userObj.email;
        document.getElementById('profileUsername').textContent = userObj.username;
    }

    // ===== TOGGLE PROFILE INFO =====
    var toggleProfileBtn = document.getElementById('toggleProfileBtn');
    var profileInfo = document.getElementById('profileInfo');

    toggleProfileBtn.addEventListener('click', function () {
        if (profileInfo.style.display === 'none') {
            profileInfo.style.display = 'block';
            profileInfo.classList.add('profile-show');
            toggleProfileBtn.innerHTML = '<span class="toggle-icon">▼</span> Hide Profile Info';
            toggleProfileBtn.classList.add('active');
        } else {
            profileInfo.style.display = 'none';
            profileInfo.classList.remove('profile-show');
            toggleProfileBtn.innerHTML = '<span class="toggle-icon">▶</span> View Profile Info';
            toggleProfileBtn.classList.remove('active');
        }
    });

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
        document.getElementById('changeNewPassword').value = "";
        document.getElementById('changeConfirmPassword').value = "";
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
    changePassForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        var oldpass = document.getElementById('oldPassword').value;
        var newpass = document.getElementById('changeNewPassword').value;
        var confirmpass = document.getElementById('changeConfirmPassword').value;

        if (!currentUser) {
            showPasswordMessage("No logged-in user.", "error");
            return;
        }

        /*if (oldpass !== users[currentUser]) {
            showPasswordMessage("Old password is incorrect.", "error");
            return;
        }*/

        if (oldpass !== currentUser.password) {
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

        const index = users.findIndex(u => u.username === currentUser.username);
        if (index === -1) {
            showPasswordMessage("User not found.", "error");
            return;
        }
        users[index].password = newpass;
        currentUser = users[index];

        const saved = await saveUsersToFile();

        if (saved) {
            showMessage("Password changed successfully.", 'success');
            setTimeout(function () {
                changePassModal.classList.remove('show-modal');
            }, 1500);
        } else {
            showMessage("Failed to save new password.", 'error');
        }
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