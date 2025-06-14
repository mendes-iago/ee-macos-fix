// O editor Ace pode não estar disponível imediatamente.
// Vamos esperar até que ele seja carregado.
const waitForAceEditor = setInterval(() => {
    // A instância do editor Ace geralmente está anexada ao elemento DOM.
    // O editor do GEE está dentro de um elemento com a classe 'ace_editor'.
    const editorElement = document.querySelector('.ace_editor');

    // A propriedade 'env' do elemento geralmente contém o editor.
    if (editorElement && editorElement.env && editorElement.env.editor) {
        clearInterval(waitForAceEditor); // Para o loop assim que encontrar o editor
        const editor = editorElement.env.editor;
        console.log('Ace Editor instance found. Applying fixes...');
        applyFixes(editor);
    }
}, 500); // Tenta a cada 500ms

function applyFixes(editor) {

    // --- Solução para o Atalho (Ctrl + Space) ---
    // Esta abordagem é mais robusta que simular cliques.
    // Ela adiciona um novo comando ao gerenciador de comandos do Ace.
    // A extensão "Open Earth Engine" usa uma técnica similar.
    editor.commands.addCommand({
        name: 'showAutocomplete',
        bindKey: {
            win: 'Ctrl-Space',
            mac: 'Ctrl-Space|Cmd-Space' // Adiciona múltiplos binds para Mac
        },
        exec: function (editor) {
            // Executa o comando de autocompletar nativo do Ace
            editor.execCommand("startAutocomplete");
        }
    });

    // --- Tentativa de Solução para Acentuação (Complexo) ---
    // Corrigir a entrada de "dead keys" (teclas mortas) é um problema complexo.
    // A abordagem abaixo é um "proof-of-concept" e pode precisar de ajustes.
    // Ela intercepta a tecla de acento e tenta compor o caractere manualmente.

    let accentPressed = false;

    editor.textInput.getElement().addEventListener('keydown', function (e) {
        // Verifica se a tecla pressionada é o apóstrofo/acento agudo
        if (e.key === "'") {
            accentPressed = true;
            // Previne a ação padrão para evitar o duplo apóstrofo
            e.preventDefault();
        }
    });

    editor.textInput.getElement().addEventListener('keyup', function (e) {
        if (accentPressed) {
            const charMap = {
                'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú',
                'A': 'Á', 'E': 'É', 'I': 'Í', 'O': 'Ó', 'U': 'Ú',
                'c': 'ç', 'C': 'Ç'
                // Adicione outras combinações se necessário
            };

            if (charMap[e.key]) {
                editor.insert(charMap[e.key]); // Insere o caractere acentuado
            } else {
                editor.insert("'" + e.key); // Se não for uma vogal, insere o acento e a tecla
            }
            accentPressed = false; // Reseta o estado
            e.preventDefault();
        }
    });

    console.log('Fixes have been applied.');
}
