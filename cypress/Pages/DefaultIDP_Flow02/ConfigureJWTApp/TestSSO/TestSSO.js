import { TestSSO } from "../../../../Object Repo/DefaultIDP_Flow02/ConfigureJWTApp/TestSSO/TestSSOSelectors"; 
import { wordPressidpSelectors } from '../../../../Object Repo/DefaultIDP/ConfigureIDP/WordPressIdPSelectors/WordPressIdPSelectors';

let brokerurl ;
class TestSSOFlow {
    
    copyingurl() {
        // Capture Broker URL
        cy.get(TestSSO.endpoints).click();
        cy.get(TestSSO.copyurl)
        .invoke('val')
        .then((url) => {
            cy.log('Captured Broker URL: ' + url);
            brokerurl = url;
        });

        // Sign out before SSO test
        cy.get(TestSSO.settings).click();
        cy.get(TestSSO.signout).click();
        cy.wait(4000);
    }

    visitAndLogin(username, password) {
    // Visit the stored Broker URL
    cy.then(() => {
      cy.log('Visiting Broker URL: ' + brokerurl);
      cy.visit(brokerurl, { failOnStatusCode: false });

      cy.url().then((redirectedUrl) => {
        const redirectedOrigin = new URL(redirectedUrl).origin;

        // Pass your selectors object through args
        cy.origin(
          redirectedOrigin,
          {
            args: {
              username,
              password,
              selectors: {
                continue: wordPressidpSelectors.continue,
                username: wordPressidpSelectors.username,
                password: wordPressidpSelectors.password,
                submit: wordPressidpSelectors.submit
              }
            }
          },
          ({ username, password, selectors }) => {
            // Now use the selectors passed in
            cy.get(selectors.continue).click({ force: true });
            cy.get(selectors.username).type(username);
            cy.get(selectors.password).type(password);
            cy.get(selectors.submit).click();
          }
        );
      });
    });

    cy.location('href', { timeout: 20000 }).should('include', 'jwt.io');
    cy.get(TestSSO.cross).click();
  }

}

export default new TestSSOFlow();