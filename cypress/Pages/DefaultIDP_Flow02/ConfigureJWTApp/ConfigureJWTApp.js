import { CustomJWtApp } from '../../../Object Repo/DefaultIDP_Flow02/ConfigureJWTApp/ConfigureJWTAppSelectors';

class JWTApp {
    addapp (apptype,appname,url){ 
        cy.get(CustomJWtApp.appsmenu).click();
        cy.get(CustomJWtApp.addapp).click();
        cy.get(CustomJWtApp.selectjwt).type(apptype);
        cy.get(CustomJWtApp.customjwt).click();
        cy.get(CustomJWtApp.appname).type(appname);
        cy.get(CustomJWtApp.redirecturl).type(url);
        cy.get(CustomJWtApp.save).click();

    }

} 

export default new JWTApp(); 