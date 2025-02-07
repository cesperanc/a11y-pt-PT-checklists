import normalize from "./assets/scripts/Config.js";

const Config = normalize({
    '1.0': [
        {
            groupID: `1`,
            groupName: `Menu de navegação`,
            tests: [
                {
                    testID: `1.1`,
                    name: `O menu de navegação deve estar estruturado como uma lista de opções`,
                    description: `Para que possa ser bem interpretado por tecnologias de apoio, os menus e submenus devem estar estruturados com elementos nativos, do tipo <ul>, ou com a semântica e o estado dos elementos identificados com técnicas em ARIA.`,
                },
                {
                    name: `É possível selecionar as opções e as subopções do menu quer com rato quer com teclado`,
                    description: `Deve ser possível percorrer a estrutura de navegação quer com um dispositivo apontador quer com o teclado.`,
                },
                {
                    name: `As imagens-link, caso existam no menu, devem ter o correspondente equivalente alternativo em texto`,
                    description: `As imagens corretamente legendadas permitem ser interpretadas como texto, tornando todas as opções de navegação acessíveis.`,
                }
            ]
        },
        {
            groupName: `Títulos e subtítulos`,
            tests: [
                {
                    name: `Existe um título <h1> marcado na página`,
                    description: `O título principal de cada página, que sumariza o seu conteúdo, deve ser identificado como o primeiro nível dos títulos (h1). Não deverá ser utilizado mais do que um <h1> por página.`,
                },
                {
                    name: `Existe uma marcação hierarquizada de títulos e subtítulos na página (<h1>...<h6>)`,
                    description: `Os títulos são empregues de forma hierárquica para melhor estruturar os conteúdos, das informações mais gerais às mais particulares. Deverão ser usados de forma consistente por todo o sítio Web.`,
                },
            ]
        },
        {
            groupName: `Tabelas de dados`,
            tests: [
                {
                    name: `As células que constituem os cabeçalhos da tabela estão marcadas com o elemento <th>`,
                    description: `Identificar os cabeçalhos de uma tabela ajuda a melhor identificar os eixos que caracterizam a informação em cada célula.`,
                },
                {
                    name: `A legenda da tabela está marcada com o elemento <caption>`,
                    description: `Todas as tabelas deverão conter uma legenda descritiva do seu conteúdo, incluindo as fontes da informação, se necessário.`,
                },
            ]
        },
        {
            groupName: `Estrutura da informação`,
            tests: [
                {
                    name: `Ao clicar com o rato na etiqueta, o cursor surge no respetivo campo de edição`,
                    description: `De forma a tornar a seleção de campos pequenos mais fácil, a legenda deverá estar associada ao campo respetivo com o elemento <label>, pois desta forma aumenta-se a sua área clicável. Para os utilizadores de leitores de ecrã (pessoas cegas) a associação da etiqueta ao campo de edição é também fundamental.`,
                },
                {
                    name: `É possível identificar os campos de preenchimento obrigatório quando se usa apenas um leitor de ecrã`,
                    description: `Os campos obrigatórios devem ser preferencialmente agrupados na parte inicial de um formulário e claramente identificados como tal. Se não for possível, cada campo deverá estar identificado textualmente ou como Obrigatório ou como Opcional. Não deverão ser usados apenas símbolos ou cores como elemento identificador.`,
                },
                {
                    name: `É possível localizar e ler as mensagens de erro usando apenas um leitor de ecrã`,
                    description: `Os erros identificados no decorrer do preenchimento de um formulário deverão preferencialmente ser listados de forma condensada, direcionando cada elemento da lista ao respetivo campo. Cada campo deverá associar a mensagem de erro a si próprio. As mensagens de erro deverão ser breves e claras.`,
                },
            ]
        },
        {
            groupName: `Gráficos e imagens-link`,
            tests: [
                {
                    name: `A imagem ou gráfico tem um equivalente alternativo em texto curto e correto`,
                    description: `As imagens não decorativas deverão ter uma descrição breve associada, nomeadamente através do uso do atributo <ALT>. Esta legenda deve descrever fielmente o propósito da imagem no contexto em que se encontra.`,
                },
                {
                    name: `O gráfico é acompanhado de uma descrição longa`,
                    description: `Gráficos resultantes de análise de dados deverão ser acompanhados da tabela de dados que lhe deu origem, de forma a preservar o acesso à informação completa.`,
                },
                {
                    name: `As imagens-link têm um equivalente alternativo correto`,
                    description: `As hiperligações compostas apenas por uma imagem obrigam que esta tenha um equivalente alternativo em texto que represente fielmente o destino da hiperligação.`,
                },
            ]
        },
        {
            groupName: `Contraste`,
            tests: [
                {
                    name: `No corpo de um documento, o rácio de contraste entre a cor do texto normal (menor que 18 pontos ou menor que 14 pontos negrito) e a cor do fundo é superior a 4,5:1`,
                    description: `Deve assegurar-se no corpo do documento que o rácio de contraste entre a cor do texto e a cor de fundo é, no mínimo, de 4,5:1, de forma a assegurar a sua legibilidade para utilizadores com deficiências da visão.`,
                },
                {
                    name: `O rácio de contraste entre a cor do texto de tamanho grande (maior ou igual que 18 pontos ou maior ou igual que 14 pontos negrito) e a cor do fundo é superior a 3:1`,
                    description: `Os textos de tamanho superior a 18 pontos, ou os textos de tamanho superior a 14 pontos mas a negrito, devem assegurar um rácio de contraste mínimo de 3:1 entre a cor do texto e a cor do fundo.`,
                },
            ]
        },
        {
            groupName: `Players`,
            tests: [
                {
                    name: `Deve ser possível ativar os botões de controlo do leitor quer com o rato quer com o teclado`,
                    description: `Os leitores de multimédia não devem iniciar automaticamente a reprodução dos elementos e têm de ser operáveis usando apenas um rato ou usando apenas um teclado.`,
                },
                {
                    name: `O vídeo ou o áudio deve conter preferencialmente legendas fechadas sincronizadas. Caso não seja possível, no mínimo, deve disponibilizar-se uma transcrição textual`,
                    description: `O uso de legendas fechadas destina-se essencialmente a pessoas surdas. Recomendam-se para a produção das referidas legendas técnicas de tradaptação conhecidas para o efeito bem como o enriquecimento das legendas de sons cuja mensagem não seja percetível visualmente (por ex., o toque de uma campaínha de uma porta).

                    Para vídeos com mensagens eminentemente visuais (por ex., um vídeo com música de fundo que passa um conjunto de mensagens apenas percetíveis à visão), os mesmos devem ter uma versão equivalente alternativa com produção de audiodescrição. A audiodescrição é fundamental para que pessoas cegas ou com baixa visão possam percecionar a mensagem veiculada.`,
                },
            ]
        },
        {
            groupName: `Estrutura da página`,
            tests: [
                {
                    name: `Quando se retira a CSS, todos os elementos HTML devem alinhar à esquerda`,
                    description: `Quando se desativam todos os estilos visuais, o conteúdo da página é apresentado alinhado à esquerda e apresenta-se de forma linear.`,
                },
                {
                    name: `Quando se retira a CSS, a informação aparece numa ordem lógica`,
                    description: `Tendo em conta que o posicionamento de elementos no código pode não refletir a ordem visual de leitura, deve ser assegurada a ordem correta do conteúdo quando se desativam os estilos visuais.`,
                },
                {
                    name: `Quando se retira a CSS, deve ser possível reconhecer a semântica dos diversos elementos`,
                    description: `Os elementos que estruturam o conteúdo devem estar semanticamente bem estruturados, usando os elementos de HTML apropriados a cada tipo de conteúdo, como títulos, parágrafos, listas, ...`,
                },
                {
                    name: `Quando se retira a CSS, a informação relevante permanece visível`,
                    description: `Toda a informação visível deve permanecer na página sob forma textual, quando se desativam os estilos visuais.`,
                },
                {
                    name: `A maquetização da página é feita sem recorrer ao elemento <table>`,
                    description: `A estrutura de composição gráfica da página não é feita recorrendo a elementos de tabela mas sim a uma maior diversidade de elementos semânticos (por ex., <main>) e genéricos (por ex., <div>), que permitem a recomposição visual para diferentes tipos e dimensões de ecrã.`,
                },
            ]
        },
        {
            groupName: `Modais`,
            tests: [
                {
                    name: `Quando a caixa de diálogo é aberta, o foco (cursor do Browser) move-se para um elemento dentro da caixa de diálogo`,
                    description: `Assim que a caixa de edição se sobrepõe à janela, o cursor do Browser deve saltar para dentro da caixa de diálogo.`,
                },
                {
                    name: `Quando uma caixa de diálogo está aberta, a navegação com teclado (Browser ou Tecnologia de apoio) tem de ficar circunscrita aos elementos que compõem a caixa de diálogo`,
                    description: `Quando a caixa de diálogo está aberta, todos os outros elementos que se encontram fora da caixa devem permanecer inertes. Mesmo os elementos interativos (links, botões ou campos de edição) devem deixar de ser focáveis quer com teclado quer com o rato. Quando a caixa de diálogo está aberta, se ativar um leitor de ecrã e ele efetuar a leitura ou permitir focar elementos interativos que estão fora da caixa de diálogo, algo está errado.`,
                },
                {
                    name: `A caixa de diálogo tem de ter um mecanismo que permita sair ou fechar a caixa, quer através de teclado quer através de um dispositivo apontador`,
                    description: `A caixa de diálogo deve ter um mecanismo que permita sair ou fechar a caixa. Pode ser um botão "Fechar". Para além do botão "Fechar" é possível adicionar a tecla de atalho "ESC".`,
                },
                {
                    name: `Quando a caixa de diálogo fecha, o foco (cursor do Browser) deve voltar ao elemento interativo que a invocou`,
                    description: `É útil que ao sair da modal, o utilizador seja posicionado no elemento que usou para invocar a modal. A modal é uma espécie de parêntesis, à conversa principal. É bom que o utilizador, depois do "parêntesis", possa voltar à conversa principal, no exato ponto onde a deixou.`,
                },
            ]
        },
        {
            groupName: `Ficheiros PDF`,
            tests: [
                {
                    name: `Nos ficheiros PDF é possível, no mínimo, extrair o conteúdo textual para formato TXT`,
                    description: `Os ficheiros PDF devem ter o seu texto inteiramente extraível para que se possa passar o respetivo conteúdo para um processador de texto sem perda de informação.`,
                },
            ]
        },
    ]
});

export default Config;