import { LoginSelectors } from "../../Object Repo/Flows/loginobjects";

class Login {
    visit(){
        cy.visit('https://bhargavpardikar.miniorange.in/moas/login');
    }   

    performlogin(username,password){
        cy.get(LoginSelectors.usernameInput).type(username);
        cy.get(LoginSelectors.login).click();
        cy.get(LoginSelectors.passwordInput).type(password);
        cy.get(LoginSelectors.login).click();
    }

    checkLogin(){
        cy.contains('Get Started in Minutes').should('be.visible'); 
    }

}

export default new Login();