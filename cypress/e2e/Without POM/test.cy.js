//Login to Dashboard function
function loginToDashboard() {
  cy.visit('https://bhargavpardikar.miniorange.in/moas/login');
  cy.get('#username').type('bhargav.pardikar@xecurify.com'); // Enter Username
  cy.get('#loginbutton').click();
  cy.get('#plaintextPassword').type('demouser'); // Enter Password
  cy.get('#loginbutton').click();

  // Assertion - Verify dashboard loaded
  cy.url().should('eq', 'https://bhargavpardikar.miniorange.in/moas/admin/customer/home');
  cy.get('.btn.btn-dark.w-50').click();
  cy.get('.btn.btn-light').click();
  cy.get('.btn.btn-light').click();
  cy.contains('Get started in minutes').should('be.visible');
  cy.log('Logged in and landed on dashboard');
}


describe('miniOrange: WordPress as External IdP flows', () => {


  //1️⃣ Configuring the External IdP on MiniOrange Dashboard
  it('Login in MiniOrange Dashboard and capture OAuth Callback URL' , () => {
    loginToDashboard(); 

    //Navigate to Identity Providers
    cy.log('Navigate to Identity Providers');
    cy.get('[data-testid="sidebar-identity-provider-link"]').click(); // Going to IdP tab 
    cy.contains('External Identity Providers').should('be.visible');
    cy.log('Clicked Identity Providers'); 

    //Click Add Identity Providers
    cy.log('Click Add Identity Providers');
    cy.get('[data-testid="add-connection-button"]').click(); // Click on Add IdP
    cy.contains('External Identity Providers').should('be.visible');
    cy.log('Clicked button');
    
    //clicked on dropdown button
    cy.log('clicked on dropdown button')
    cy.get('[data-testid="search-bar"]').type('OAuth').wait(2000).type('{enter}'); //Search for oauth 
    cy.log('selected the OAuth') ;

    //Selecting the OAuth IDP
    cy.log('Selecting the OAuth IDP');
    cy.get('[data-testid="oauth-provider-oauth-idp-card"]').click();
    cy.contains('OAuth Identity Provider').should('be.visible');
    cy.log('display page opens');
  
    //Filling the Details of IDP
    cy.log('Fill Display Name for IdP');
    cy.get('[data-testid="displayname-input"]').clear().type('WordPressTestIdP'); // named the idp
    cy.log('Copy OAuth Callback URL - click copy button and store to alias'); 

    // ✅ Capture OAuth callback URL and save to file
    cy.get('[data-testid="oauthcallbackurl-input"]').invoke('val')
      .then((cbUrl) => {
        const oauthCallbackUrl = cbUrl.trim();
        cy.log('Captured OAuth Callback URL: ' + oauthCallbackUrl);

        // Save to file (fixtures folder)
        cy.writeFile('cypress/fixtures/oauthData.json', { oauthCallbackUrl });
      });

    // Save IDP Configuration
    cy.get('[data-testid="save-button"]').click();
    cy.contains('External Identity Providers').should('be.visible');
  }); 



  //2️⃣ Configuring the WordPress Plugin using saved callback URL
  it('Configure WordPress Plugin using saved OAuth data' , () => {
    
    // ✅ Read the saved OAuth callback URL from file
    cy.readFile('cypress/fixtures/oauthData.json').then((data) => {
      const callbackUrl = data.oauthCallbackUrl;

      cy.log('Using saved Callback URL: ' + callbackUrl);

      cy.origin('https://dev-wordpress-provisioning.pantheonsite.io', { args: { callbackUrl } }, ({ callbackUrl }) => {
        cy.log('Visiting WordPress Admin Login Page');
        cy.visit('/wp-login.php');  
        
        cy.get('.pds-button', { timeout: 10000 })
          .should('be.visible')
          .click({ force: true });  // Continue button 

        cy.url().should('include', '/wp-login.php');
        cy.log('WordPress login page loaded successfully');

        //WordPress Admin Login
        cy.get('#user_login').should('be.visible').type('bhargav.pardikar@xecurify.com');    
        cy.get('#user_pass').should('be.visible').type('Bhargav@26');
        cy.get('#wp-submit').click();

        cy.url().should('include', 'wp-admin');  
        cy.log('Logged in as WordPress Admin');

        // Open miniOrange OAuth Plugin
        cy.get('#toplevel_page_mo_oauth_server_settings div.wp-menu-name', { timeout: 10000 })
          .should('be.visible')
          .click({ force: true }); 
        cy.log('Configuring miniOrange OAuth Server Plugin');

        // Click “Configure App” (orange button)
        cy.get('a.miniorange-oauth-20-server-orange-color').first().click({ force: true });
        cy.wait(2000);
        cy.log('Opened the Plugin Dashboard');

        // Paste Redirect URI from file
        cy.get('input[name="redirect_uri"]').clear().type(callbackUrl);

        // ✅ Capture all client details and write back to file
        const oauthData = {};

        cy.get('[data-tooltip="Copy Client ID"]').invoke('val').then((clientId) => {
          oauthData.clientId = clientId?.trim() || 'N/A';
        });

        cy.get('[data-tooltip="Copy Client Secret"]').invoke('text').then((clientSecret) => {
          oauthData.clientSecret = clientSecret?.trim() || 'N/A';
        });

        cy.get('[data-tooltip="Copy Authorization Endpoint"]').invoke('text').then((authEndpoint) => {
          oauthData.authEndpoint = authEndpoint?.trim() || 'N/A';

          // Save everything together
          cy.writeFile('cypress/fixtures/oauthData.json', { ...oauthData, callbackUrl });
          cy.log('Saved Client Info and Endpoints to oauthData.json');
        });
      });
    });
  });




  //3️⃣ Completing the IDP configuration, Then Creating the User, Creating App, Creating Policies
  it('Completing the IdP configuration' , () =>{
    cy.readFile('cypress/fixtures/oauthData.json').then((data) => {
      cy.log('OAuth Data:', JSON.stringify(data, null, 2));
    });
  }); 


  //4️⃣ Copying the Broker Flow URL  and Testing the SSO Flow
  it('Broker Flow URL', () => {
    cy.log('Broker flow testing logic to be implemented...');
  }); 
});



// //Login to Dashboard function
// function loginToDashboard() {
//   cy.visit('https://bhargavpardikar.miniorange.in/moas/login');
//   cy.get('#username').type('bhargav.pardikar@xecurify.com'); // Enter Username
//   cy.get('#loginbutton').click();
//   cy.get('#plaintextPassword').type('demouser'); // Enter Password
//   cy.get('#loginbutton').click();

//   // Assertion - Verify dashboard loaded
//   cy.url().should('eq', 'https://bhargavpardikar.miniorange.in/moas/admin/customer/home');
//   cy.get('.btn.btn-dark.w-50').click();
//   cy.get('.btn.btn-light').click();
//   cy.get('.btn.btn-light').click();
//   cy.contains('Get started in minutes').should('be.visible');
//   cy.log('Logged in and landed on dashboard');
// }


// describe('miniOrange: WordPress as External IdP flows', () => {


//   //1️⃣ Configuring the External IdP on MiniOrange Dashboard
//   it('Login in MiniOrange Dashboard and capture OAuth Callback URL' , () => {
//     loginToDashboard(); 

//     //Navigate to Identity Providers
//     cy.log('Navigate to Identity Providers');
//     cy.get('[data-testid="sidebar-identity-provider-link"]').click(); // Going to IdP tab 
//     cy.contains('External Identity Providers').should('be.visible');
//     cy.log('Clicked Identity Providers'); 

//     //Click Add Identity Providers
//     cy.log('Click Add Identity Providers');
//     cy.get('[data-testid="add-connection-button"]').click(); // Click on Add IdP
//     cy.contains('External Identity Providers').should('be.visible');
//     cy.log('Clicked button');
    
//     //clicked on dropdown button
//     cy.log('clicked on dropdown button')
//     cy.get('[data-testid="search-bar"]').type('OAuth').wait(2000).type('{enter}'); //Search for oauth 
//     cy.log('selected the OAuth') ;

//     //Selecting the OAuth IDP
//     cy.log('Selecting the OAuth IDP');
//     cy.get('[data-testid="oauth-provider-oauth-idp-card"]').click();
//     cy.contains('OAuth Identity Provider').should('be.visible');
//     cy.log('display page opens');
  
//     //Filling the Details of IDP
//     cy.log('Fill Display Name for IdP');
//     cy.get('[data-testid="displayname-input"]').clear().type('WordPressTestIdP'); // named the idp
//     cy.log('Copy OAuth Callback URL - click copy button and store to alias'); 

//     // ✅ Capture OAuth callback URL and save to file
//     cy.get('[data-testid="oauthcallbackurl-input"]').invoke('val')
//       .then((cbUrl) => {
//         const oauthCallbackUrl = cbUrl.trim();
//         cy.log('Captured OAuth Callback URL: ' + oauthCallbackUrl);

//         // Save to file (fixtures folder)
//         cy.writeFile('cypress/fixtures/oauthData.json', { oauthCallbackUrl });
//       });

//     // Save IDP Configuration
//     cy.get('[data-testid="save-button"]').click();
//     cy.contains('External Identity Providers').should('be.visible');
//   }); 



//   //2️⃣ Configuring the WordPress Plugin using saved callback URL
//   it('Configure WordPress Plugin using saved OAuth data' , () => {
    
//     // ✅ Read the saved OAuth callback URL from file
//     cy.readFile('cypress/fixtures/oauthData.json').then((data) => {
//       const callbackUrl = data.oauthCallbackUrl;

//       cy.log('Using saved Callback URL: ' + callbackUrl);

//       cy.origin('https://dev-wordpress-provisioning.pantheonsite.io', { args: { callbackUrl } }, ({ callbackUrl }) => {
//         cy.log('Visiting WordPress Admin Login Page');
//         cy.visit('/wp-login.php');  
        
//         cy.get('.pds-button', { timeout: 10000 })
//           .should('be.visible')
//           .click({ force: true });  // Continue button 

//         cy.url().should('include', '/wp-login.php');
//         cy.log('WordPress login page loaded successfully');

//         //WordPress Admin Login
//         cy.get('#user_login').should('be.visible').type('bhargav.pardikar@xecurify.com');    
//         cy.get('#user_pass').should('be.visible').type('Bhargav@26');
//         cy.get('#wp-submit').click();

//         cy.url().should('include', 'wp-admin');  
//         cy.log('Logged in as WordPress Admin');

//         // Open miniOrange OAuth Plugin
//         cy.get('#toplevel_page_mo_oauth_server_settings div.wp-menu-name', { timeout: 10000 })
//           .should('be.visible')
//           .click({ force: true }); 
//         cy.log('Configuring miniOrange OAuth Server Plugin');

//         // Click “Configure App” (orange button)
//         cy.get('a.miniorange-oauth-20-server-orange-color').first().click({ force: true });
//         cy.wait(2000);
//         cy.log('Opened the Plugin Dashboard');

//         // Paste Redirect URI from file
//         cy.get('input[name="redirect_uri"]').clear().type(callbackUrl);

//         // ✅ Capture all client details and write back to file
//         const oauthData = {};

//         cy.get('[data-tooltip="Copy Client ID"]').invoke('val').then((clientId) => {
//           oauthData.clientId = clientId?.trim() || 'N/A';
//         });

//         cy.get('[data-tooltip="Copy Client Secret"]').invoke('text').then((clientSecret) => {
//           oauthData.clientSecret = clientSecret?.trim() || 'N/A';
//         });

//         cy.get('[data-tooltip="Copy Authorization Endpoint"]').invoke('text').then((authEndpoint) => {
//           oauthData.authEndpoint = authEndpoint?.trim() || 'N/A';

//           // Save everything together
//           cy.writeFile('cypress/fixtures/oauthData.json', { ...oauthData, callbackUrl });
//           cy.log('Saved Client Info and Endpoints to oauthData.json');
//         });
//       });
//     });
//   });




//   //3️⃣ Completing the IDP configuration, Then Creating the User, Creating App, Creating Policies
//   it('Completing the IdP configuration' , () =>{
//     cy.readFile('cypress/fixtures/oauthData.json').then((data) => {
//       cy.log('OAuth Data:', JSON.stringify(data, null, 2));
//     });
//   }); 


//   //4️⃣ Copying the Broker Flow URL  and Testing the SSO Flow
//   it('Broker Flow URL', () => {
//     cy.log('Broker flow testing logic to be implemented...');
//   }); 
// });




