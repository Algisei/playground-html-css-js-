import { CommandCenterBackEnd } from './CommandCenterBackEnd.js';

export class CommandCenter {
    constructor(containerId, game) {
        this.container = document.getElementById(containerId);
        this.backend = new CommandCenterBackEnd(game);
        this.createButtons(this.backend.getInitialButtons());
    }

    createButtons(buttons) {
        this.container.innerHTML = ''; // Clear existing buttons
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.id = button.id;
            btn.textContent = button.label;
            btn.addEventListener('click', () => this.handleButtonClick(button.id));
            this.container.appendChild(btn);
        });
    }

    handleButtonClick(buttonId) {
        const newButtons = this.backend.handleButtonClick(buttonId);
        if (newButtons) {
            this.createButtons(newButtons);
        }
    }
}
