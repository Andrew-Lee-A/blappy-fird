/**
 * class represents the shop menu of a game
 * note that the class uses two controllers (view class)
 * as the dataStorage controller is used to determine
 * when the shop controller needs to be called to manipulate
 * the locale storage...
 */
class ShopMenu extends Phaser.Scene {
    constructor() {
        super({key: 'ShopMenu'});
        this.skins = ['default-skin', 'bear-skin', 'frog-skin'];
        this.skinIndex = 0;
        this.skinCosts = [0, 50, 100];
        this.shopController = new ShopController();
    }

    preload() {
        this.load.image("right-arrow", "assets/shop/arrow.png");
        this.load.image("default-skin", "assets/shop/player-spriteS.png");
        this.load.image("ticket", "assets/shop/ticket-sprite.png");
        this.load.image("equip", "assets/shop/equip.png");
        this.load.image("buy", "assets/shop/buy.png");
        this.load.image("home", "assets/shop/home.png");

        // alternative skins
        this.load.image("frog-skin", "assets/shop/frog-skin.png");
        this.load.image("bear-skin", "assets/shop/bear-skin.png");
    }

    create() {
        const ARROW_DIMENSIONS = {width: 60, height: 54};
        const TICKET_DIMENSIONS = {width: 29, height: 40};
        const SPITE_OFFSET = 150;
        const SPRITE_SPACING = 300;

        const spacing = this.shopController.shopMenuSpacing(config.width, config.height, ARROW_DIMENSIONS, SPRITE_SPACING);
        const data = new DataStorage();

        this.skinIndex = 0; // important for when scene restarts...
        this.title = this.add.text(spacing.titleLocation.x, spacing.titleLocation.y, 'SHOP / EQUIP', {font: '70px'});

        this.rightArrow = this.add.sprite(spacing.rightArrowStart.x, spacing.rightArrowStart.y, "right-arrow");
        this.leftArrow = this.add.sprite(spacing.leftArrowStart.x, spacing.leftArrowStart.y, "right-arrow");
        this.leftArrow.flipX = true;
        this.equip = this.add.sprite(spacing.leftArrowStart.x + (SPRITE_SPACING / 2), spacing.leftArrowStart.y, "equip");
        this.equip.setInteractive();

        this.playerTicket = this.add.sprite(spacing.costLocation.x, spacing.costLocation.y, "ticket");
        this.playerTicketText = this.add.text(spacing.costLocation.x + TICKET_DIMENSIONS.width, spacing.costLocation.y - (TICKET_DIMENSIONS.height / 3), " : " + data.getCoin(), {font: '32px'});
        this.costTicketText = this.add.text(spacing.costLocation.x - (TICKET_DIMENSIONS.width / 2) , spacing.costLocation.y + TICKET_DIMENSIONS.height, "COSTS: OWNED", {font: '32px'});

        this.currentSkin = this.add.sprite(spacing.leftArrowStart.x + (SPRITE_SPACING / 2), spacing.rightArrowStart.y - SPITE_OFFSET, 'default-skin');
        this.currentSkin.setScale(2);

        const homeCoord = this.shopController.getHomePos(config.height);
        this.home = this.add.sprite(homeCoord.x, homeCoord.y, 'home');

        this.updateInterface(this.equip, this.costTicketText);
        this.addArrowListeners(this.leftArrow, this.rightArrow, this.equip, this.costTicketText);
        this.addHomeListener(this.home);
    }

    update() {

    }

    addArrowListeners(leftArrow, rightArrow, actionBtn, costText) {
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
                this.shakeCamera(200, 0.01);
            }

            this.updateDisplayedSkin(this.skins[this.skinIndex]);
            this.updateInterface(actionBtn, costText);
        });

        rightArrow.on('pointerdown', () => {
            if(this.skinIndex + 1 < this.skins.length) {
                this.skinIndex++;
            } else {
                this.shakeCamera(200, 0.01);
            }

            this.updateDisplayedSkin(this.skins[this.skinIndex]);
            this.updateInterface(actionBtn, costText);
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

    shakeCamera(shakeDuration, shakeIntensity) {
        this.cameras.main.shake(shakeDuration, shakeIntensity);
    }

    updateInterface(actionBtn, costText) {
        const data = new DataStorage();
        const HOVERED_SKIN = this.skins[this.skinIndex];

        let skinNum = this.getSkinIndex(HOVERED_SKIN);

        const unlocked = data.getUnlocks();
        if(unlocked[skinNum] === "true") {
            actionBtn.setTexture("equip");
            costText.setText("COSTS: OWNED");
            
            // check if equiped
            if(skinNum === data.getCurrentSkin()) { // is equiped
                actionBtn.alpha = 0.5;
                this.skinEquipedListener(actionBtn);
            } else { // not equiped
                actionBtn.alpha = 1;
                this.equipSkinListener(actionBtn);
            }
        } else {
            actionBtn.alpha = 1;
            actionBtn.setTexture("buy");
            costText.setText("COSTS: " + this.skinCosts[skinNum]);
            this.buyListener(actionBtn, costText);
        }
    }

    skinEquipedListener(actionBtn) {
        actionBtn.alpha = 0.5;
        actionBtn.on('pointerdown', () => {
            // do nothing...
        })
    }

    equipSkinListener(actionBtn) {
        actionBtn.alpha = 1;
        actionBtn.on('pointerdown', () => {
            this.equipSkin(actionBtn);
        })
    }

    buyListener(actionBtn, costText) {
        actionBtn.on('pointerdown', () => {
            const data = new DataStorage();

            if(data.getUnlocks()[this.getSkinIndex(this.skins[this.skinIndex])] === "false") {
                actionBtn.alpha = 1;
                let skinNum = this.getSkinIndex(this.skins[this.skinIndex]);

                if(data.getCoin() >= this.skinCosts[skinNum]) {
                    let skinIndex = this.getSkinIndex(this.skins[this.skinIndex]);
                    this.shopController.unlockSkin(skinIndex, this.skinCosts[skinIndex]);

                    // change button to be an equip display
                    actionBtn.setTexture("equip");
                    costText.setText("COSTS: OWNED");
                    this.playerTicketText.setText(" : " + data.getCoin());
                    this.equipSkin(actionBtn);
                } else {
                    this.shakeCamera(200, 0.01);
                }
            }
        })
    }

    getSkinIndex(currentSkin) {
        let skinNum = -1;
        if(currentSkin === 'default-skin') {
            skinNum = 0;
        } else if (currentSkin === 'bear-skin') {
            skinNum = 1;
        } else if (currentSkin === 'frog-skin') {
            skinNum = 2;
        }

        if(skinNum < 0) {
            throw 'skin hovered not valid';
        }
        return skinNum;
    }

    addHomeListener(homeBtn) {
        homeBtn.alpha = 0.5;
        homeBtn.setInteractive();
        homeBtn.on('pointerover', function() {
            homeBtn.alpha = 1;
        });

        homeBtn.on('pointerout', function() {
            homeBtn.alpha = 0.5;
        })

        homeBtn.on('pointerdown', () => {
            this.scene.stop('ShopMenu');
            this.scene.start('MainMenu');
        })
    }

    equipSkin(actionBtn) {
        this.shopController.setSkin(this.getSkinIndex(this.skins[this.skinIndex])); // map the skin to data store index
        this.skinEquipedListener(actionBtn);
    }
}