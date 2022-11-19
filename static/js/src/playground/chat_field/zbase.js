class ChatField {
    constructor(playground) {
        this.playground = playground;
        this.$history = $(`<div class="ac-game-chat-history">消息记录</div>`);
        this.$input = $(`<input type="text" class="ac-game-chat-input">`);

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.$history.show();
        this.$input.hide();

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    render_message(message) {
        return $(`<div>${message}</div>`);
    }

    add_message(username, content) {
        let message = `${username}: ${content}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    add_listening_events() {
        let outer = this;
        this.$input.keydown(function(e) {
            if (e.which === 27) {
                outer.hide_input();
                return false;
            } else if (e.which === 13) {
                let username = outer.playground.root.settings.username;
                let content = outer.$input.val();
                if (content){
                    outer.$input.val(""); // 清空输入框
                    outer.add_message(username, content);
                    outer.playground.mps.send_message(username, content);
                }
                return false;
            }
        });
    }

    show_input() {
        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}
