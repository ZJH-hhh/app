class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "Web";
        if (this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app2606.acapp.acwing.com.cn/static/image/settings/acwing_log.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app2606.acapp.acwing.com.cn/static/image/settings/acwing_log.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    </div>
</div>
`);

        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$acwing_login = this.$settings.find(".ac-game-settings-acwing img");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_register.click(function() {
            outer.register();
        });

        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });

        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app2606.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(response) {
                if (response.result === "success") {
                    window.location.replace(response.apply_code_url);
                }
            }
        });
    }

    login_on_remote(username, password) { // 在远程服务器登录
        username = username || this.$login_username.val();
        password = password || this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://app2606.acapp.acwing.com.cn/settings/api/token/",
            type: "POST",
            data: {
                username: username,
                password: password,
            },
            success: response => {
                this.root.access = response.access;
                this.root.refresh = response.refresh;
                this.getinfo_web();
                this.refresh_jwt_token();
            },
            error: () => {
                this.$login_error_message.html("用户名或密码错误");
            }
        });
    }

    register_on_remote() { // 在远程服务器上注册
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app2606.acapp.acwing.com.cn/settings/register/",
            type: "POST",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: response => {
                if (response.result === "success") {
                    this.login_on_remote(username, password);
                } else {
                    this.$register_error_message.html(response.result);
                }
            }
        });
    }

    logout_on_remote() { // 在远程服务器登出
        if (this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            this.root.access = "";
            this.root.refresh = "";
            location.href = "/";
        }
    }


    start() {
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            if (this.root.access) {
               this.getinfo_web();
                this.refresh_jwt_token();
            } else {
                this.login();
            }
            this.add_listening_events();
        }
    }

    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() { // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;

        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(response) {
            if (response.result === "success") {
                outer.username = response.username;
                outer.photo = response.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    refresh_jwt_token() {
        setInterval(() => {
            $.ajax({
                url: "https://app2606.acapp.acwing.com.cn/settings/api/token/refresh/",
                type: "POST",
                data: {
                    refresh: this.root.refresh,
                },
                success: response => {
                    this.root.access = response.access;
                }
            })
        }, 4.5 * 60 * 1000);
    }

    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://app2606.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(response) {
                if (response.result === "success") {
                    outer.acapp_login(response.appid, response.redirect_uri, response.scope, response.state);
                }
            }
        });
    }

    getinfo_web() {
        let outer = this;

        $.ajax({
            url: "https://app2606.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            headers: {
                "Authorization": "Bearer " + this.root.access,
            },
            success: function(response) {
                console.log(response);
                if (response.result === "success") {
                    outer.username = response.username;
                    outer.photo = response.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }

    show() {
        this.$settings.show();
    }

    hide() {
        this.$settings.hide();
    }
}
