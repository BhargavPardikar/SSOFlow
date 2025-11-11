import { IdPSelectors } from '../../../../Object Repo/DefaultIDP/ConfigureIDP/miniOrangeIDPSelectors/ConfigureidpSelectors' ; 

class configureidp{

    addidp(idptype,idpname){
        cy.get(IdPSelectors.idpmenu).click();
        cy.get(IdPSelectors.addidp).click();
        cy.get(IdPSelectors.searchidp).type(idptype);
        cy.get(1000);
        cy.get(IdPSelectors.clickidp).click();  
        cy.get(IdPSelectors.displayname).clear().type(idpname); 
        

    }

    copyredirecturl() { 
        cy.get(IdPSelectors.redirecturl) // Target the element using the selector from your Object Repo
            .invoke('val')              // Invoke the 'val' jQuery function to get the current value of the input
            .then((callbackURL) => {    // Use .then() to work with the retrieved value
                cy.wrap(callbackURL).as('callbackURL'); // Wrap the value and save it as an alias
            });
    }

    visitidppage(idpurl){
        cy.visit(idpurl);
    }  


    pastingtheurls(urls,idpname) {

        //cy.visit('https://bhargavpardikar.miniorange.in/moas/admin/customer/customoauthconfiguration?cardId=OAuth%20Provider');
        //this.reloginIfExpired(username, password) 

        cy.get(IdPSelectors.displayname).wait(2000).clear().wait(2000).type(idpname);
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

    makedefault(idpname){
        cy.get(IdPSelectors.search).type(idpname);
        cy.get(IdPSelectors.actionsbutton).click();
        cy.get(IdPSelectors.makedefault).click();
        cy.get(IdPSelectors.makedefaultconfirm).last().click({ force: true }); //canrfind any selector here
    }

};

export default new configureidp();


