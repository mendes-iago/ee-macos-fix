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

function initializeEditorEnhancements() {
    const CODE_EDITOR = ".ace_editor";
    let attemptCount = 0;
    const maxAttempts = 20;

    const intervalId = setInterval(() => {
        const editorElement = document.querySelector(CODE_EDITOR);
        attemptCount++;

        if (editorElement && editorElement.env && editorElement.env.editor) {
            clearInterval(intervalId); // Para de tentar assim que encontra o editor.
            const editor = editorElement.env.editor;

            console.log("Ace instance found. Applying enhancements...");

            // Aplica as opções de configuração.
            editor.setOptions(EDITOR_OPTIONS);

            // Adiciona os comandos personalizados.
            CUSTOM_COMMANDS.forEach(command => editor.commands.addCommand(command));
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