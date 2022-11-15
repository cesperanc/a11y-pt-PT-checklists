import normalize from "./assets/scripts/Config.js";

const Config = normalize({
    '1.0': [
        {
            groupName: `Formulários`,
            tests: [
                {
                    name: `A sequência de tabulação entre campos segue a sequência de preenchimento`,
                    description: `A ordem de tabulação por entre os campos deve corresponder à sequência normal de preenchimento do formulário.`,
                },
                {
                    name: `Os formulários com mais de 2 ecrãs de altura devem ser distribuídos por várias páginas`,
                    description: `Os formulários não devem ser apresentados de forma excessivamente longa. Os formulários que ocupem mais de 2 ecrãs de altura devem ser distribuídos por tantos ecrãs quantos os necessários, para cumprir com esta regra. Os formulários longos podem também ter vários momentos de interação diferidos, solicitando ao utilizador a informação absolutamente necessária em cada etapa, em oposição à solicitação de toda a informação necessária logo num primeiro momento de interação.`,
                },
                {
                    name: `Os formulários com mais de uma página têm a sequência de passos ilustrada`,
                    description: `Os formulários distribuídos por várias páginas devem indicar no topo da página a sequência de passos necessária para os concluir, juntamente com a designação de cada passo. O utilizador deve ser capaz de selecionar os passos anteriores para retornar aos ecrãs respetivos e, se necessário, corrigir informação.`,
                },
            ]
        },
        {
            groupName: `Campos`,
            tests: [
                {
                    name: `O tamanho dos campos deve refletir o tamanho previsível dos dados`,
                    description: `O tamanho dos campos deve refletir o tamanho previsível para a entrada dos dados. Por exemplo, um campo para telefone deve ter a largura estritamente necessária para conter todos os dígitos. Nem mais nem menos.`,
                },
                {
                    name: `É usada revelação progressiva em vez de campos inativos`,
                    description: `Em vez de mostrar campos inativos, o formulário deve esconder os campos dependentes do campo-chave sempre que este não tenha sido ativado. Ao ativar o campo-chave são exibidos os campos que dependem da condição nele definida.`,
                },
                {
                    name: `As legendas dos campos são breves e claras`,
                    description: `As legendas associadas aos campos devem ser claras e o mais breves possível, sem recorrer a grandes explicações. Se essas explicações forem necessárias, devem ser apresentadas num bloco de texto paralelo.`,
                },
                {
                    name: `Campos obrigatórios devem ser claramente indicados como tal`,
                    description: `A identificação não deve basear-se apenas na cor. A sinalética visual de identificação deve ser notória. Deve ser disponibilizado um equivalente alternativo compatível com as tecnologias de apoio usadas por utilizadores com necessidades especiais.`,
                }
            ]
        },
        {
            groupName: `Resposta`,
            tests: [
                {
                    name: `Em ações longas, o sistema deve indicar o que está a acontecer`,
                    description: `O sistema deve indicar o que está a processar ou qual o tempo de espera expectável quando o utilizador desencadeia ações que levem a este comportamento.`,
                },
                {
                    name: `Deve ser confirmado o sucesso da transação/envio de informação`,
                    description: `O sucesso de uma transação deve ser claramente comunicado ao utilizador através de uma mensagem de confirmação.`,
                }
            ]
        },
        {
            groupName: `Erros`,
            tests: [
                {
                    name: `A informação já introduzida deve poder ser corrigida a qualquer momento`,
                    description: `Toda a informação já transmitida pelo utilizador numa sessão pode ser corrigida, em qualquer momento, antes da transação ser finalizada.`,
                },
                {
                    name: `As ações destrutivas nunca devem ser permanentes; deve ser sempre possível desfazer a operação`,
                    description: `O utilizador deve poder recuperar de qualquer ação que tenha tomado durante a sessão.`,
                },
                {
                    name: `As mensagens de erro são claramente identificadas junto aos campos de origem`,
                    description: `As mensagens de erro devem ser apresentadas claramente associadas aos campos a que dizem respeito. Isto não invalida a necessidade de as apresentar numa lista sumário. Esta última técnica é particularmente útil em páginas longas.`,
                },
                {
                    name: `As mensagens de erro devem mostrar os passos concretos para a resolução dos mesmos`,
                    description: `As mensagens de erro devem ser claras e sucintas, não expondo desnecessariamente o utilizador a mecanismos internos do sistema, explicando claramente os passos necessários para que o utilizador resolva o problema.`,
                },
            ]
        }
    ]
});

export default Config;