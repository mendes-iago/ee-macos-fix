const EDITOR_OPTIONS = {
    wrap: 80,
    showPrintMargin: true,
    printMarginColumn: 80,
    wrapBehavioursEnabled: true,
    behavioursEnabled: true,
    cursorStyle: "smooth"
};

const CUSTOM_COMMANDS = [
    {
        name: "customSave",
        bindKey: { mac: "Cmd-S" },
        exec: (editor) => {
            // Chama o comando de salvar nativo do GEE ou o do Ace.
            const saveButton = document.querySelector("ee-button[icon='save']");
            if (saveButton) {
                saveButton.click();
            } else {
                console.warn("DEBUG: Save button not found.");
            }
        },
    },
    {
        name: "customSuggestion",
        bindKey: { mac: "Shift-Tab" },
        exec: (editor) => {
            editor.execCommand("startAutocomplete");
        },
    },
];

/**
 * Modifica os atalhos do teclado dos comandos existentes no editor Ace.
 * Esta é a abordagem mais confiável para o GEE, pois ele pré-registra seus próprios comandos.
 * @param {object} editor A instância do editor Ace.
 */
function applyCustomKeybindings(editor) {
    try {
        const commands = editor.commands.commands;

        // Modifica o atalho para o comando de sugestão de código existente.
        if (commands.Suggestion) {
            commands.Suggestion.bindKey.mac = "Shift-Tab";
            console.log("Keybinding for 'Suggestion' remapped to Shift-Tab");
        } else {
            console.warn("'Suggestion' command not found. Cannot remap key.");
        }

        // Garante que o atalho para salvar está configurado corretamente.
        if (commands.Save) {
            commands.Save.bindKey.mac = "Cmd-S";
            console.log("Keybinding for 'Save' confirmed for Cmd-S.");
        } else {
            console.warn("'Save' command not found. Cannot remap key.");
        }

        // Esta linha é crucial. Ela força o editor a recarregar o mapa de comandos.
        // Sem ela, as alterações nos atalhos não são aplicadas.
        editor.commands.addCommands(commands);
    } catch (error) {
        console.error("An error occurred while applying keybindings.", error);
    }
}

function initializeEditorEnhancements() {
    const CODE_EDITOR = ".ace_editor";
    let attemptCount = 0;
    const maxAttempts = 20; // Limite de 10 segundos.

    console.log("Searching for Ace editor instance...");

    const intervalId = setInterval(() => {
        const editorElement = document.querySelector(CODE_EDITOR);
        attemptCount++;

        if (editorElement && editorElement.env && editorElement.env.editor) {
            clearInterval(intervalId); // Para de tentar assim que encontra o editor.
            const editor = editorElement.env.editor;

            console.log("Ace instance found. Applying enhancements...");

            // Aplica as opções de configuração visual.
            editor.setOptions(EDITOR_OPTIONS);

            // Adiciona os comandos personalizados.
            applyCustomKeybindings(editor);

            console.log("Enhancements applied successfully.");
            return;
        }

        if (attemptCount >= maxAttempts) {
            clearInterval(intervalId);
            console.error("Could not find Ace editor instance after 10 seconds.");
        }
    }, 500);
}

initializeEditorEnhancements();