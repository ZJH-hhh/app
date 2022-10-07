class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div>
游戏界面
</div>
`)

        this.root.$ac_game.append(this.$playground);
        this.start();
    }

    start() {
   }

    // 打开playground界面
    show() {
        this.$playground.show();
    }

    // 关闭playground界面
    hide() {
        this.$playground.hide();
    }
}
