import { TestSSO } from "../../../../Object Repo/DefaultIDP_Flow02/ConfigureJWTApp/TestSSO/TestSSOSelectors"; 
import { wordPressidpSelectors } from '../../../../Object Repo/DefaultIDP/ConfigureIDP/WordPressIdPSelectors/WordPressIdPSelectors';

class TestSSOFlow {
    copyingurl() {
        cy.get(TestSSO.endpoints).click();
        cy.get(TestSSO.copyurl).invoke('val').then((url) => {
            cy.log('Captured Broker URL: ' + url);
            cy.wrap(url).as('brokerurl');
        });

        cy.get(TestSSO.settings).click();
        cy.get(TestSSO.signout).click();
        cy.wait(5000);

        cy.get('@brokerurl').then((brokerurl) => {
            cy.log('🌐 Visiting Broker URL: ' + brokerurl);
            cy.visit(brokerurl, { failOnStatusCode: false });
        });
}


    checkingflow(username,password){

        cy.get(TestSSO.submitconsent).click({force:true});
        cy.get(wordPressidpSelectors.continue).click({force:true});
        cy.get(wordPressidpSelectors.username).type(username);
        cy.get(wordPressidpSelectors.password).type(password);
        cy.get(wordPressidpSelectors.submit).click(); 
         
        cy.get(TestSSO.cross).click();


        
    }

}

export default new TestSSOFlow();