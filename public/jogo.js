var larguraTela = 1024
var alturaTela = 768
var game = new Phaser.Game(larguraTela, alturaTela, Phaser.CANVAS, 'gameDiv')

var garrafa_vidro;

var prefix = {
    'spr': 'spr_',
    'lix': 'lix_',
    'img': 'img'
}

var espacoEntreLixeiras = 25
var altura_padrao_lixeiras = 120
var largura_padrao_lixeiras = 200
var deslocador_lixeiras = 120
var lixeiras = {
    'width': altura_padrao_lixeiras,
    'height': largura_padrao_lixeiras,
    'tipos': {
        'papel': {
            'desc': 'Papel',
            'png': 'assets/lixeiras/azul.png',
            'posX': deslocador_lixeiras + 70,
            'posY': alturaTela - largura_padrao_lixeiras
        },
        'plastico': {
            'desc': 'Plástico',
            'png': 'assets/lixeiras/vermelha.png',
            'posX': deslocador_lixeiras + 70 + altura_padrao_lixeiras * 1 + espacoEntreLixeiras,
            'posY': alturaTela - largura_padrao_lixeiras
        },
        'metal': {
            'desc': 'Metal',
            'png': 'assets/lixeiras/amarela.png',
            'posX': deslocador_lixeiras + 70 + altura_padrao_lixeiras * 2 + espacoEntreLixeiras * 2,
            'posY': alturaTela - largura_padrao_lixeiras
        },
        'vidro': {
            'desc': 'Vidro',
            'png': 'assets/lixeiras/verde.png',
            'posX': deslocador_lixeiras + 70 + altura_padrao_lixeiras * 3 + espacoEntreLixeiras * 3,
            'posY': alturaTela - largura_padrao_lixeiras
        },
        'organico': {
            'desc': 'Orgânico',
            'png': 'assets/lixeiras/marrom.png',
            'posX': deslocador_lixeiras + 70 + altura_padrao_lixeiras * 4 + espacoEntreLixeiras * 4,
            'posY': alturaTela - largura_padrao_lixeiras

        },
    }
}

var posLixeiras = {}

var residuos = {
    'path_png': 'assets/residuos',
    'tipos': {
        'organico': {
            'banana': {
                'desc': 'Banana',
                'png': 'b_casa_banana.png'
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

var mainState = {
    preload: function () {

        // Fundo do cenario
        game.load.image("background", "assets/fundo2.png")

        // carregando as lixeiras
        for (var k in lixeiras.tipos) {
            game.load.image(prefix['lix'] + k, lixeiras['tipos'][k]['png'])
        }

        // carregando os residuos
        for (var t in residuos['tipos']) {
            for (var i in residuos['tipos'][t]) {
                var nome = [prefix['img'], t, i].join('_')
                var png = [residuos['path_png'], t, residuos['tipos'][t][i]['png']].join('/')
                game.load.image(nome, png)
                // console.log('Carregando imagem:', nome)
            }
        }

        // Draw debug tools

    },
    create: function () {

        game.add.tileSprite(0, 0, larguraTela, alturaTela, 'background');

        // Desenhando as lixeiras na tela
        for (var k in lixeiras.tipos) {
            var sprName = prefix['spr'] + k
            sprName = game.add.sprite(lixeiras['tipos'][k]['posX'], lixeiras['tipos'][k]['posY'], prefix['lix'] + k)
            posLixeiras[k] = {
                'posXinicial': lixeiras['tipos'][k]['posX'],
                'posXfinal': lixeiras['tipos'][k]['posX'] + lixeiras['width'],
                'posYinicial': lixeiras['tipos'][k]['posY'],
                'posYfinal': lixeiras['tipos'][k]['posY'] + lixeiras['height']
            }
        }

        // criando os LIXOS
        criaResiduos(20)
    },
    update: function () {

        // function onDragStart(sprite, pointer) {
        //     dragPosition.set(sprite.x, sprite.y)
        // }
    },
    render: function () {

    }

}

var temp;


function soltou(sprite, pointer, dadosLixo) {
    result = sprite.key + ' dropped at x:' + sprite.x + ' y: ' + sprite.y;

    tipo_residuo = dadosLixo['tipo']

    //testar se esta dentro de alguma lixeira, depois ver se a lixeira eh a correta
    var tiposConhecidos = Object.keys(lixeiras['tipos'])
    for(var i = 0; i < tiposConhecidos.length; i++) {
        tipo = tiposConhecidos[i]
        if (pointer.x > posLixeiras[tipo]['posXinicial'] && pointer.x < posLixeiras[tipo]['posXfinal'] && pointer.y > posLixeiras[tipo]['posYinicial'] && pointer.y < posLixeiras[tipo]['posYfinal']) {
            if(tipo_residuo == tipo) {
                swal({
                    title: 'Parabéns!',
                    text: "VOCÊ ACERTOU",
                    imageUrl: lixeiras['tipos'][tipo]['png']
                });
                console.log('Correta:', tiposConhecidos[i])
                destroyResiduo(sprite)
            }
            else {
                console.log('Errada: ', tiposConhecidos[i])
            }
        }
    }
}

function destroyResiduo(residuo){
    residuo.destroy()
}

function criaObjeto(item, dadosLixo) {
    posX = Math.floor((Math.random() * larguraTela * .8) + 50);
    posY = Math.floor((Math.random() * alturaTela/2) + 20);
    objeto = game.add.sprite(posX, posY, item)
    objeto.inputEnabled = true
    objeto.input.enableDrag()
    // console.log(dadosLixo)
    objeto.events.onDragStop.add(soltou, this, '', dadosLixo)
}

function criaResiduos(qtd) {
    var tiposConhecidos = Object.keys(residuos['tipos'])
    for (x = 0; x < qtd; x++) {

        // escolhe um tipo
        var tipoEscolhido = tiposConhecidos[Math.floor(Math.random() * tiposConhecidos.length)]

        //cata um item dentro do tipo selecionado
        var itensConhecidos = Object.keys(residuos['tipos'][tipoEscolhido])
        var itemEscolhido = itensConhecidos[Math.floor(Math.random() * itensConhecidos.length)]

        //criaObjeto(tipoEscolhido, residuos['tipos'][tipoEscolhido][itemEscolhido])
        objetoParaCriar = [prefix['img'], tipoEscolhido, itemEscolhido].join('_')
        // console.log('Criar o objeto com a imagem:', objetoParaCriar)
        criaObjeto(objetoParaCriar, {'tipo': tipoEscolhido})
    }
}

game.state.add('mainState', mainState)
game.state.start('mainState')
