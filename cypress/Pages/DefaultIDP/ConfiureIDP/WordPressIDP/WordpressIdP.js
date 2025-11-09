import {wordPressidpSelectors} from "../../../Object Repo/DefaultIDP/ConfigureIDP/WordpressIdPSelectors" ;

class WordPressConfigureIdp {
    visit() {
        cy.visit('https://dev-wordpress-provisioning.pantheonsite.io/login.php/');
    }

    wordpresslogin(username,password) {
        cy.get(wordPressidpSelectors.continue).click({force:true});
        cy.get(wordPressidpSelectors.username).type(username);
        cy.get(wordPressidpSelectors.password).type(password);
        cy.get(wordPressidpSelectors.submit).click();

    } 

    confiureplugin(){
        cy.get(wordPressidpSelectors.oauthplugin).click();
        cy.get(wordPressidpSelectors.configureapp, { timeout: 15000 }).first().click({ force: true }); 
        cy.get('@callbackURL').then((callbackURL) => {
             // Now 'callbackURL' holds the string value you want to use.
             cy.get(wordPressidpSelectors.redirecturl) // Assuming you have a selector for the input field
                .clear()
                .type(callbackURL); 
        });
        cy.get(wordPressidpSelectors.update).click(); 

    }

    copyingCredentials() {
    let urls = {};
    const timeout = 15000;
    const extractEndpointText = (containsText, logMessage) => {
        cy.log(`Attempting to capture ${logMessage}...`);
        return cy.contains('tr', containsText, { timeout })
            .find(wordPressidpSelectors.endpointCell)
            .should('exist')
            .invoke('text');
    };

    // 🔴 VERY IMPORTANT: RETURN this whole Cypress chain
    return (
        // 1️⃣ Client ID
        extractEndpointText(wordPressidpSelectors.clientid, 'Client ID')
            .then((t) => {
                urls.clientId = t.trim() || 'N/A';
                cy.log('Captured Client ID: ' + urls.clientId);
            })

        // 2️⃣ Client Secret
            .then(() => {
                cy.log('Attempting to capture Client Secret...');
                return cy.contains('tr', wordPressidpSelectors.clientsectret, { timeout })
                    .find(wordPressidpSelectors.clientSecretInput)
                    .should('exist')
                    .invoke('val');
            })
            .then((secret) => {
                urls.clientSecret = secret.trim() || 'N/A';
                cy.log('Captured Client Secret: ' + urls.clientSecret);
            })

        // 3️⃣ Authorization Endpoint
            .then(() => extractEndpointText(wordPressidpSelectors.authoeisationendpoint, 'Authorization Endpoint'))
            .then((auth) => {
                urls.auth = auth.trim() || 'N/A';
                cy.log('Captured Auth Endpoint: ' + urls.auth);
            })

        // 4️⃣ Token Endpoint
            .then(() => extractEndpointText(wordPressidpSelectors.tokenendpoint, 'Token Endpoint'))
            .then((token) => {
                urls.token = token.trim() || 'N/A';
                cy.log('Captured Token Endpoint: ' + urls.token);
            })

        // 5️⃣ UserInfo Endpoint
            .then(() => {
                cy.log('Capturing Userinfo Endpoint...');
                return cy.get('tr')
                    .contains(wordPressidpSelectors.userinfo, { timeout })
                    .parent('tr')
                    .find(wordPressidpSelectors.endpointCell)
                    .invoke('text');
            })
            .then((userInfo) => {
                urls.userInfo = userInfo.trim();
                cy.log('Captured Userinfo Endpoint: ' + urls.userInfo);
            })

        // 6️⃣ Scopes
            .then(() => extractEndpointText(wordPressidpSelectors.scopes, 'Scopes'))
            .then((scopes) => {
                urls.scopes = scopes.trim() || 'N/A';
                cy.log('Captured Scopes: ' + urls.scopes);
            })

        // ✅ Finally wrap and return `urls`
            .then(() => cy.wrap(urls))
    );
}

    



} ;

export default new WordPressConfigureIdp();