import normalize from "./assets/scripts/Config.js";

const Config = normalize({
    '1.0': [
        {
            groupID: `1`,
            groupName: `Clareza do conteúdo`,
            tests: [
                {
                    testID: `1.1`,
                    name: `O sítio Web apresenta um resumo breve do seu propósito, visível sem se fazer scroll`,
                    description: `Num primeiro vislumbre do sítio Web deve ser visível uma breve definição do seu propósito que dê a indicação ao utilizador de que sítio Web se trata e quais são as tarefas que se podem levar a efeito.`,
                },
                {
                    name: `Os termos mais complexos têm uma definição agregada`,
                    description: `Quando são usados termos complexos ou técnicos que não sejam de uso corrente, estes devem ter agregada uma definição. Todos os termos definidos desta forma devem fazer parte de um glossário disponível no sítio Web.`,
                },
                {
                    name: `Cada bloco de conteúdo contém a sua data de atualização`,
                    description: `Cada bloco de conteúdo isolado ou conjunto de blocos de conteúdo relacionado deverá ter a data da sua atualização associada, expressa num tamanho de letra 2 pontos abaixo ao do corpo do texto, com contraste mais reduzido mas nunca inferior a 4,5:1.`,
                },
                {
                    name: `A informação sobre a entidade responsável pelo conteúdo está em todas as páginas`,
                    description: `A identificação da entidade responsável pelos conteúdos produzidos, incluindo uma hiperligação para a página de contactos deverá constar do rodapé de todas as páginas.`,
                }
            ]
        },
        {
            groupName: `Usabilidade do conteúdo`,
            tests: [
                {
                    name: `O tipo de letra do corpo do documento é adequado e o tamanho da letra é, no mínimo, de 12 pontos`,
                    description: `De forma a assegurar a boa legibilidade do texto para todos os utilizadores, o tamanho de letra do texto que compõe o corpo do documento deverá ser, no mínimo, de 12 pontos, assegurando sempre que os mesmos são escaláveis para tamanhos superiores, sempre que o utilizador considere necessário.`,
                },
                {
                    name: `A informação secundária (datas, autores) utiliza, no mínimo, um tamanho de letra de 10 pontos`,
                    description: `A informação secundária, como os autores de textos ou de imagens, as datas de publicação ou outros tipos de meta-informação, podem usar tamanhos de letra mais pequenos, mas, no mínimo, com 10 pontos, assegurando sempre que os mesmos são escaláveis para tamanhos superiores, sempre que o utilizador considere necessário.`,
                },
                {
                    name: `Blocos e linhas de texto com largura não superior a 100 caracteres`,
                    description: `Para manter o conforto de leitura, os blocos ou linhas de texto não deverão ter mais de 100 caracteres de largura. Os 80 caracteres correspondem à dimensão que se apresenta nos estudos como a mais confortável para os utilizadores.`,
                },
                {
                    name: `O espaçamento entre linhas não é inferior a 1.5x o tamanho da letra`,
                    description: `Para assegurar a leitura confortável de blocos de texto deve ser usado um espaçamento entre linhas de 1.5x o tamanho da letra.`,
                },
            ]
        },
        {
            groupName: `Estrutura da navegação`,
            tests: [
                {
                    name: `Nenhum nível de navegação tem mais de 9 opções`,
                    description: `A navegação principal deve ser equilibrada, nem com demasiadas opções de topo sem opções secundárias, nem com poucas opções de topo e muitas opções secundarias. Nenhum nível de navegação deve ter mais de 9 opções.`,
                },
                {
                    name: `A navegação principal está sempre visível e sempre no mesmo local`,
                    description: `As opções de primeiro nível da navegação principal estão sempre visíveis e encontram-se sempre no mesmo local em todas as páginas. A posição atual do utilizador na estrutura de navegação deve ser evidenciada.`,
                },
                {
                    name: `As hiperligações de texto não devem ser diferenciadas apenas com base na cor`,
                    description: `As hiperligações de texto devem apresentar um contraste mínimo de 4,5:1 com a envolvente e uma representação visual complementar à cor - idealmente as hiperligações devem apresentar-se sublinhadas. As hiperligações em texto devem apresentar-se da mesma forma em todo o sítio Web.`,
                },
            ]
        },
        {
            groupName: `Estrutura da informação`,
            tests: [
                {
                    name: `Os documentos longos têm um índice no topo com hiperligações internas para o mesmo`,
                    description: `Os documentos com mais de três ecrãs de altura deverão ter a hierarquia de cabeçalhos espelhada num índice no topo da página com hiperligações internas para as respetivas secções e subsecções.`,
                },
                {
                    name: `O layout do sítio Web é adaptável a plataformas móveis sem necessidade de efetuar varrimento horizontal`,
                    description: `O layout do sítio Web deve ser adaptável aos tamanhos mais comuns de visualização, adaptando-se a várias larguras de ecrã sem que surjam barras de varrimento horizontais.`,
                },
            ]
        },
        {
            groupName: `Elementos interativos`,
            tests: [
                {
                    name: `Não existem elementos interativos acionados apenas com a passagem do rato (hover)`,
                    description: `Não devem existir elementos de interação, como hiperligações ou botões, que aparecem apenas quando se passa por cima com um dispositivo apontador. Este método de interação não está disponível em aparelhos com interação por toque.`,
                },
                {
                    name: `Os elementos interativos têm uma dimensão mínima de 44px CSS (44 pontos) (vertical e horizontal)`,
                    description: `De forma a assegurar que todos os elementos interativos são facilmente acionáveis por qualquer tipo de dispositivo apontador ou toque, estes devem ter a dimensão mínima de 44px CSS de altura e de largura.`,
                },
                {
                    name: `Há apenas um botão de ação principal por página e o mesmo encontra-se destacado`,
                    description: `Deve existir apenas um botão de ação principal por página e o mesmo deve apresentar-se numa cor contrastante. Todos os outros botões devem ser considerados como secundários.`,
                },
                {
                    name: `Elementos gráficos interativos têm de aparentar ser clicáveis`,
                    description: `Os elementos gráficos clicáveis devem ser percecionáveis como tal, através da forma, da cor ou do aparente volume.`,
                },
            ],
        }
    ]
});

export default Config;