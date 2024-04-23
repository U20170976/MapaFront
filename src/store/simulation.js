class Simulation{

    constructor(props){
        this.simulation = false;
    }

    runSimulation(idSimulation){
        this.simulation = true;
        localStorage.setItem('idSimulation', idSimulation);
        localStorage.setItem('running', JSON.stringify(this.simulation));
    }

    stopSimulation(){
        this.simulation = false;
        localStorage.removeItem('idSimulation');
        localStorage.removeItem('running');
    }

    isRunning(){
        return localStorage.getItem('running');
    }

    getIdSimulation(){
        var idSimulation = localStorage.getItem('idSimulation');
        return idSimulation;
    }

}
export default new Simulation();