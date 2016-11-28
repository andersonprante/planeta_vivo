var game = new Phaser.Game(800,600, Phaser.CANVAS, 'gameDiv')

var fundo;
var fundoVelocidade;
var cursors;

var mainState = {
    preload: function(){
        game.load.image('fundo', 'assets/fundoComEstrelas.png')
        game.load.image('player', 'assets/player2.png')
    },
    create: function(){
        fundo = game.add.tileSprite(0, 0, 800, 600, 'fundo')
        fundoVelocidade = 1

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player')
        game.physics.enable(player, Phaser.Physics.ARCADE)

        cursors = game.input.keyboard.createCursorKeys()
    },
    update: function(){
        fundo.tilePosition.y += fundoVelocidade

        player.body.velocity.x = 0

        if(cursors.left.isDown)
            player.body.velocity.x = -450
        else if(cursors.right.isDown)
            player.body.velocity.x = 450


    }

}

game.state.add('mainState', mainState)

game.state.start('mainState')