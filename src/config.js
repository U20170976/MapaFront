export default {
  colors: {
    default: "#344675",
    primary: "#42b883",
    info: "#1d8cf8",
    danger: "#fd5d93",
    teal: "#00d6b4",
    primaryGradient: ['rgba(76, 211, 150, 0.1)', 'rgba(53, 183, 125, 0)', 'rgba(119,52,169,0)'],
  },
  saltoTemporalSimulacionIniciar: 2,
  NSimulacionIniciar: 10,
  FitnessSimulacionIniciar: 20000, 
  saltoTemporalSimulacionContinuar: 2,
  NSimulacionContinuar: 10,
  FitnessSimulacionContinuar: 10000, 
  delaySimulacion: 500,
  //urlBase: 'http://localhost'
  // urlBase: 'http://localhost:8080' //con el puerto modificado de Renzo
  urlBase: 'http://127.0.0.1:8080'  //con el puerto modificado de Renzo
  //urlBase: 'https://inf226-982-3c.inf.pucp.edu.pe/tomcat'
  
}