// cypress/e2e/wordpress_config.cy.js

describe('WordPress - Configure OAuth Plugin using MiniOrange Redirect URL', () => {

  it('Use Redirect URL to Configure WordPress Plugin and Save OAuth Data', () => {

    cy.readFile('cypress/fixtures/oauthData.json').then((data) => {
      const { redirectUrl } = data;

      cy.origin('https://dev-wordpress-provisioning.pantheonsite.io', { args: { redirectUrl } }, ({ redirectUrl }) => {
        cy.log('🔑 Visiting WordPress Admin Login Page');
        cy.visit('/wp-login.php');

        cy.get('.pds-button', { timeout: 15000 }).should('be.visible').click({ force: true });
        cy.get('#user_login', { timeout: 20000 }).should('be.visible').type('bhargav.pardikar@xecurify.com');
        cy.get('#user_pass').type('Bhargav@26');
        cy.get('#wp-submit').click();

        cy.url().should('include', 'wp-admin');
        cy.log('✅ Logged into WordPress Admin');

        // Navigate to OAuth Plugin
        cy.get('#toplevel_page_mo_oauth_server_settings div.wp-menu-name').click({ force: true });
        cy.get('a.miniorange-oauth-20-server-orange-color').first().click({ force: true });

        // Paste Redirect URL from MiniOrange
        cy.get('input[name="redirect_uri"]').clear().type(redirectUrl);
        cy.log('🔗 Pasted Redirect URL from MiniOrange');

        // Click Update / Save
        cy.contains('Update', { timeout: 10000 }).click({ force: true });
        cy.wait(3000);

        // Capture OAuth details from WordPress plugin UI
        const oauthData = {};

        cy.get('[data-tooltip="Copy Client ID"]').invoke('text').then((id) => {
          oauthData.clientId = id.trim();
        });

        cy.get('[data-tooltip="Copy Client Secret"]').invoke('text').then((secret) => {
          oauthData.clientSecret = secret.trim();
        });

        cy.get('[data-tooltip="Copy Authorization Endpoint"]').invoke('text').then((auth) => {
          oauthData.authorizationEndpoint = auth.trim();
        });

        cy.get('[data-tooltip="Copy Token Endpoint"]').invoke('text').then((token) => {
          oauthData.tokenEndpoint = token.trim();
        });

        cy.get('[data-tooltip="Copy User Info Endpoint"]').invoke('text').then((userInfo) => {
          oauthData.userInfoEndpoint = userInfo.trim();
        });

        cy.get('[data-tooltip="Copy Profile Endpoint"]').invoke('text').then((profile) => {
          oauthData.profileEndpoint = profile.trim();

          // Save all OAuth details back to file
          cy.writeFile('cypress/fixtures/oauthData.json', oauthData);
          cy.log('✅ Saved all OAuth Data:', JSON.stringify(oauthData, null, 2));
        });
      });
    });
  });
});
