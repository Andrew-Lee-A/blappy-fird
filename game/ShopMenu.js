class ShopMenu extends Phaser.Scene {
    constructor() {
        super({key: 'ShopMenu'});
        this.skins = ['default-skin', 'green-skin'];
        this.skinIndex = 0;
    }

    preload() {
        this.load.image("right-arrow", "assets/shop/arrow.png");
        this.load.image("default-skin", "assets/shop/player-spriteS.png");
        this.load.image("ticket", "assets/shop/ticket-sprite.png");
        this.load.image("equip", "assets/shop/equip.png");

        // alternative skins
        this.load.image("green-skin", "assets/shop/green-skin.png");
    }

    create() {
        const ARROW_DIMENSIONS = {width: 60, height: 54};
        const TICKET_DIMENSIONS = {width: 29, height: 40};
        const SPITE_OFFSET = 150;
        const SPRITE_SPACING = 300;

        const shopController = new ShopController();
        const spacing = shopController.shopMenuSpacing(config.width, config.height, ARROW_DIMENSIONS, SPRITE_SPACING);
        const data = new DataStorage();

        this.title = this.add.text(spacing.titleLocation.x, spacing.titleLocation.y, 'SHOP / EQUIP', {font: '70px'});

        this.rightArrow = this.add.sprite(spacing.rightArrowStart.x, spacing.rightArrowStart.y, "right-arrow");
        this.leftArrow = this.add.sprite(spacing.leftArrowStart.x, spacing.leftArrowStart.y, "right-arrow");
        this.leftArrow.flipX = true;
        this.equip = this.add.sprite(spacing.leftArrowStart.x + (SPRITE_SPACING / 2), spacing.leftArrowStart.y, "equip");
        this.addArrowListeners(this.leftArrow, this.rightArrow);

        this.playerTicket = this.add.sprite(spacing.costLocation.x, spacing.costLocation.y, "ticket");
        this.playerTicketText = this.add.text(spacing.costLocation.x + TICKET_DIMENSIONS.width, spacing.costLocation.y - (TICKET_DIMENSIONS.height / 3), " : " + data.getCoin(), {font: '32px'});
        this.costTicketText = this.add.text(spacing.costLocation.x - (TICKET_DIMENSIONS.width / 2) , spacing.costLocation.y + TICKET_DIMENSIONS.height, "COSTS: OWNED", {font: '32px'});

        this.currentSkin = this.add.sprite(spacing.leftArrowStart.x + (SPRITE_SPACING / 2), spacing.rightArrowStart.y - SPITE_OFFSET, 'default-skin');
        this.currentSkin.setScale(2);
    }

    update() {

    }

    addArrowListeners(leftArrow, rightArrow) {
        leftArrow.setInteractive();
        rightArrow.setInteractive();
        
        leftArrow.alpha = 0.5;
        rightArrow.alpha = 0.5;
        this.arrowHover(leftArrow);
        this.arrowHover(rightArrow);

        leftArrow.on('pointerdown', () => {
            if(this.skinIndex - 1 >= 0) {
                this.skinIndex--;
            } else {
                this.displayNoMoreSkins(200, 0.01);
            }

            this.updateDisplayedSkin(this.skins[this.skinIndex]);
        });

        rightArrow.on('pointerdown', () => {
            if(this.skinIndex + 1 < this.skins.length) {
                this.skinIndex++;
            } else {
                this.displayNoMoreSkins(200, 0.01);
            }

            this.updateDisplayedSkin(this.skins[this.skinIndex]);
        });
    }

    arrowHover(arrow) {
        arrow.on('pointerover', function() {
            arrow.alpha = 1;
        });

        arrow.on('pointerout', function() {
            arrow.alpha = 0.5;
        })
    }

    updateDisplayedSkin(skinName) {
        this.currentSkin.setTexture(skinName);
    }

    displayNoMoreSkins(shakeDuration, shakeIntensity) {
        this.cameras.main.shake(shakeDuration, shakeIntensity);
    }

    getShopItems() {
        return {
            // your code here
        };
    }
}