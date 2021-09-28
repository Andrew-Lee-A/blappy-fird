class ShopMenu extends Phaser.Scene {
    constructor() {
        super({key: 'ShopMenu'});
    }

    preload() {
        this.load.image("right-arrow", "assets/shop/arrow.png");
        this.load.image("default-skin", "assets/shop/player-spriteS.png");
        this.load.image("ticket", "assets/shop/ticket-sprite.png");
        this.load.image("equip", "assets/shop/equip.png");
    }

    create() {
        const ARROW_DIMENSIONS = {width: 60, height: 54};
        const TICKET_DIMENSIONS = {width: 29, height: 40};
        const SPITE_OFFSET = 150;
        const SPRITE_SPACING = 300;

        const shopController = new ShopController();
        const spacing = shopController.shopMenuSpacing(config.width, config.height, ARROW_DIMENSIONS, SPRITE_SPACING);

        this.title = this.add.text(spacing.titleLocation.x, spacing.titleLocation.y, 'SHOP / EQUIP', {font: '70px'});

        this.rightArrow = this.add.sprite(spacing.rightArrowStart.x, spacing.rightArrowStart.y, "right-arrow");
        this.leftArrow = this.add.sprite(spacing.leftArrowStart.x, spacing.leftArrowStart.y, "right-arrow");
        this.leftArrow.flipX = true;
        this.equip = this.add.sprite(spacing.leftArrowStart.x + (SPRITE_SPACING / 2), spacing.leftArrowStart.y, "equip");

        this.playerTicket = this.add.sprite(spacing.costLocation.x, spacing.costLocation.y, "ticket");
        this.playerTicketText = this.add.text(spacing.costLocation.x + TICKET_DIMENSIONS.width, spacing.costLocation.y - (TICKET_DIMENSIONS.height / 3), ": OWNED", {font: '32px'});
        this.costTicketText = this.add.text(spacing.costLocation.x - (TICKET_DIMENSIONS.width / 2) , spacing.costLocation.y + TICKET_DIMENSIONS.height, "COSTS: 53", {font: '32px'});

        this.currentSkin = this.add.sprite(spacing.leftArrowStart.x + (SPRITE_SPACING / 2), spacing.rightArrowStart.y - SPITE_OFFSET, 'default-skin');
        this.currentSkin.setScale(2);
        //this.currentSkin.tint = 0x6B6F6C;
    }

    update() {

    }

    getShopItems() {
        return {
            // your code here
        };
    }
}