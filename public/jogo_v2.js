var altura = 1024;
var largura = 768;
var game = new Phaser.Game(altura, largura, Phaser.AUTO, 'gameDiv', {
    preload: preload,
    create: create,
    // update: update,
    // render: render
});

var residuos = {
    'path_png': 'assets/residuos',
    'tipos': {
        'organico': {
            'banana': {
                'desc': 'Banana',
                'png': 'b_casa_banana.png',
            },
            'maca': {
                'desc': 'Maça',
                'png': 'b_maca.png'
            },
            'guardanapo': {
                'desc': 'Guardanapo usado',
                'png': 'b_guardanapo.png'
            },
            'casca': {
                'desc': 'Casca de lapis',
                'png': 'b_casca_lapis.png'
            }
        },
        'vidro': {
            'garrafa': {
                'desc': 'Garrafa de Vidro',
                'png': 'b_garrafa_vidro.png'
            }
        },
        'papel': {
            'folha': {
                'desc': 'Folha de Papel',
                'png': 'b_papel.png'
            }
        },
        'metal': {
            'refrigerante': {
                'desc': 'Latinha',
                'png': 'b_lata.png'
            }
        },
        'plastico': {
            'garrafa': {
                'desc': 'Garrafa Pet',
                'png': 'b_pet.png'
            },
            'sacola': {
                'desc': 'Sacola Plastica',
                'png': 'b_sacola.png'
            }
        }
    }
}

var lixeiras = {
    'path': 'assets/lixeiras/',
    'tipos': {
        'organico': {
            'imagem': 'marrom.png'
        },
        'metal': {
            'imagem': 'amarela.png'
        },
        'plastico': {
            'imagem': 'vermelha.png'
        },
        'vidro': {
            'imagem': 'verde.png'
        },
        'papel': {
            'imagem': 'azul.png'
        }
    }
}

var maxElements = 20
var currentElements = 0
var residuosImages = []

function preload() {
    game.load.image('background', 'assets/fundo2.png')

    // carregando personagem
    game.load.image('mensagem', 'assets/mensagem1.png')

    game.load.image('botaoVoltar', 'assets/botaoVoltar.png')

    var tiposLixeiras = Object.keys(lixeiras['tipos'])
    for (var i=0; i < tiposLixeiras.length; i++) {
        tipo = tiposLixeiras[i]
        game.load.image(tipo, lixeiras['path'] + lixeiras['tipos'][tipo]['imagem'])
    }

    // carregar todos os tipos de residuos
    var tiposResiduos = Object.keys(residuos['tipos'])
    for (var i = 0; i < tiposResiduos.length; i++) {
        tipo = tiposResiduos[i]
        lista_residuos = Object.keys(residuos['tipos'][tipo])
        var residuo = Object.keys(residuos['tipos'][tipo])
        for (var r = 0; r < lista_residuos.length; r++) {
            var nome_residuo = residuo[r] // somente o nome do residuo
            var obj_item = residuos['tipos'][tipo][nome_residuo]
            var item = {
                'nome': tipo + '_' + nome_residuo,
                'imagem': [residuos['path_png'], tipo, obj_item['png']].join('/')
            }
            game.load.image(item['nome'], item['imagem'])
            residuosImages.push(item['nome'])
        }
    }
}

function create() {
    game.add.image(0, 0, 'background');

    for(var i = 0; i < maxElements; i++)
        criaResiduoNaTela()

}

function criaResiduoNaTela() {
    var randElement = residuosImages[Math.floor(Math.random() * residuosImages.length)];
    var posRandomX = game.world.randomX
    var item = this.game.add.sprite(posRandomX, largura + 150, randElement);
    item.angle = Math.ceil(Math.random()*360)
    item.inputEnabled = true
    item.events.onInputDown.add(efeitoBolhaSumindo, this)
    game.physics.enable(item, Phaser.Physics.ARCADE);
    item.body.velocity.y = -Math.ceil(Math.random()*40 + 10)
    item.checkWorldBounds = true;
    item.events.onOutOfBounds.add(itemOutOfScreen, this);
    return item
}

function itemOutOfScreen(item) {
    item.destroy()
    criaResiduoNaTela()
}

function efeitoBolhaSumindo(item) {
    // item.body.velocity.y=1000
    // setTimeout(function(){ item.destroy()}, 1000);
    // setTimeout(instrucoesLixeira(item), 200)
    item.destroy()
    instrucoesLixeira(item)
    criaResiduoNaTela()
}

var m_mensagem, m_botaoVoltar, m_lixeira, m_item
function instrucoesLixeira(item) {
    m_mensagem = game.add.image(0, 0, 'mensagem')
    m_botaoVoltar = this.game.add.sprite(255, 435, 'botaoVoltar')
    lixeira = item['key'].split('_')[0]
    m_lixeira = game.add.image(530,170, lixeira)
    m_item = game.add.image(130, 195, item['key'])
    game.paused = true
    game.input.onDown.add(unpause, self)
}
function unpause(event) {
    m_mensagem.destroy()
    m_botaoVoltar.destroy()
    m_lixeira.destroy()
    m_item.destroy()
    game.paused = false
}

function deslocaElemento(item, speed) {
    this.game.time.events.loop(speed, function () {
        if (item.y < 0) {
            item.destroy()
            console.log('destruiu item')
            this.game.time.events.destroy()
        }
        this.game.add.tween(item).to({
            x: item.x    ,
            y: item.y -= 2
        }, 1000, Phaser.Easing.Quadratic.InOut, true);
    }, this)
}