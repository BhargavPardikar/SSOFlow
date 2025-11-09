import { IdPSelectors } from '../../../Object Repo/DefaultIDP/ConfigureIDP/ConfigureidpSelectors' ; 

class configureidp{

    addidp(){
        cy.get(IdPSelectors.idpmenu).click();
        cy.get(IdPSelectors.addidp).click();
        cy.get(IdPSelectors.searchidp).type('OAuth');
        cy.get(1000);
        cy.get(IdPSelectors.clickidp).click();  
        cy.get(IdPSelectors.displayname).clear().type('WordPressTestIdP');
        

    }

    copyredirecturl() { 
        cy.get(IdPSelectors.redirecturl) // Target the element using the selector from your Object Repo
            .invoke('val')              // Invoke the 'val' jQuery function to get the current value of the input
            .then((callbackURL) => {    // Use .then() to work with the retrieved value
                cy.wrap(callbackURL).as('callbackURL'); // Wrap the value and save it as an alias
            });
    }

    visitidppage(){
        cy.visit('https://bhargavpardikar.miniorange.in/moas/admin/customer/customoauthconfiguration?cardId=OAuth%20Provider');
    }  

    reloginIfExpired(username, password) {
        cy.get('body').then(($body) => {
            if ($body.find('#username').length) {
                cy.log('🔐 Session expired, re-logging in...');
                cy.get('#username').type(username);
                cy.get('#loginbutton').click();
                cy.get('#plaintextPassword').type(password);
                cy.get('#loginbutton').click();

                // After login, click through dashboard setup
                cy.get('.btn.btn-dark.w-50').click();
                cy.get('.btn.btn-light').click();
                cy.get('.btn.btn-light').click();
            }
        });
    }

    pastingtheurls(urls,username, password) {

        this.visitidppage();
        this.reloginIfExpired(username, password);

        cy.get(IdPSelectors.displayname).clear().type('WordPressIdP');
        cy.get(IdPSelectors.clientid).type(urls.clientId);
        cy.get(IdPSelectors.clientsecret).type(urls.clientSecret);
        cy.get(IdPSelectors.authorisationendpoint).type(urls.auth);
        cy.get(IdPSelectors.tokenendpoint).type(urls.token);
        cy.get(IdPSelectors.userinfoendpoint).type(urls.userInfo);
        cy.get(IdPSelectors.scope).type(urls.scopes);
        cy.get(IdPSelectors.save).click();
    } 

    checkidp(){
        cy.log('Saved OAuth configuration successfully');
    }

};

export default new configureidp();