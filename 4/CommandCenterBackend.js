export class CommandCenterBackEnd {
    constructor(game) {
        this.game = game;
        this.selectedCommand = null;
    }

    getInitialButtons() {
        return [
            { id: 'bookOfScrolls', label: 'Book Of Scrolls' },
            { id: 'citadels', label: 'Citadels' },
            { id: 'fortifications', label: 'Fortifications' }
        ];
    }

    getCitadelsButtons() {
        return [
            { id: 'base', label: 'Base' },
            { id: 'programmator', label: 'Programmator' },
            { id: 'lairOfScripts', label: 'The Lair of Scripts' },
            { id: 'manufactorum', label: 'Manufactorum' }
        ];
    }

    handleButtonClick(buttonId) {
        this.selectedCommand = buttonId;
        switch (buttonId) {
            case 'bookOfScrolls':
                console.log('Book Of Scrolls clicked');
                break;
            case 'citadels':
                console.log('Citadels clicked');
                return this.getCitadelsButtons();
            case 'fortifications':
                console.log('Fortifications clicked');
                break;
            case 'base':
                console.log('Base clicked');
                this.game.setPlacementMode('circle', 'rgba(255, 105, 180, 0.5)', 4);
                break;
            case 'programmator':
                console.log('Programmator clicked');
                this.game.setPlacementMode('square', 'rgba(204, 119, 34, 0.5)', 4);
                break;
            case 'lairOfScripts':
                console.log('The Lair of Scripts clicked');
                this.game.setPlacementMode('triangle', 'rgba(160, 32, 240, 0.5)', 4);
                break;
            case 'manufactorum':
                console.log('Manufactorum clicked');
                this.game.setPlacementMode('octagon', 'rgba(0, 128, 255, 0.5)', 4);
                break;
            default:
                console.warn(`Unknown button: ${buttonId}`);
                break;
        }
        return null;
    }
}
