import { LoginSelectors } from "../../Object Repo/Flows/loginobjects";

class Login {

    visit(loginurl){
        cy.visit(loginurl);
    }   

    performlogin(username,password){
        cy.get(LoginSelectors.usernameInput).type(username);
        cy.get(LoginSelectors.login).click();
        cy.get(LoginSelectors.passwordInput).type(password);
        cy.get(LoginSelectors.login).click();
    }

    ignorebuttons() {
        cy.get('.btn.btn-dark.w-50').click();
        cy.get('.btn.btn-light').click();
        cy.get('.btn.btn-light').click();
    }

    checkLogin(){
        cy.contains('Get Started in Minutes').should('be.visible'); 
    }

    reloginIfNeeded(username, password, idpurl) {
        cy.url().then((currentUrl) => {
            // Check if user is logged out (login page)
            if (currentUrl.includes('/moas/login')) {
                cy.log('⚠️ Session expired — Logging in again...');
                this.performlogin(username, password);
                this.ignorebuttons();
                this.checkLogin();
                cy.visit(idpurl);
            } else {
                cy.log('✅ User is already logged in');
                cy.visit(idpurl);
            }
        });
    }

}

export default new Login();