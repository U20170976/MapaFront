class Authentication{

    constructor(props){
        this.authentication = false;
    }

    login(usuario){
        this.authentication = true;
        localStorage.setItem('username', JSON.stringify(usuario));
        localStorage.setItem('auth', JSON.stringify(this.authentication));
    }

    logout(){
        this.authentication = false;
        localStorage.clear();
    }

    isAuthenticated(){
        return localStorage.getItem('auth');
    }

    getProfile(){
        var username = localStorage.getItem('username');
        return JSON.parse(username);
    }

}
export default new Authentication();