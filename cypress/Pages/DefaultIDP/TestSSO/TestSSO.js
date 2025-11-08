//Automation to Implement SSO Flow keeping miniOrange as default IdP and user and 
// policy assigned is a non default group! [NEGATIVE TESTCASE]  

//Visit the URL of SP/login.php 
//Login with miniOrange, click Continue, Then IDP page opens and then unauthorised!!! 

import { TestSSO } from "../../../Object Repo/DefaultIDP/TestSSO/TestssoSelectors"; 
import {wordPressidpSelectors} from "../../../Object Repo/DefaultIDP/ConfigureIDP/WordpressIdPSelectors" ;

class testFlow {
    visit(){
        cy.visit ('https://dev-bhargavsp.pantheonsite.io/login.php/');
    } 

    flow(){
        cy.get(wordPressidpSelectors.continue).click({force:true});
        cy.get(TestSSO.loginwithminiorange).click();
    } 

    brokercreds(username,password) {
        cy.get (TestSSO.loginwithminiorange).type(username);
        cy.get(TestSSO.brokerpassword).type(password);
        cy.get(TestSSO.signin).click();

    } 

    checkConnections(){
        cy.contains('You are not authorized to login into this application.').should('be.visible');
    }
}


