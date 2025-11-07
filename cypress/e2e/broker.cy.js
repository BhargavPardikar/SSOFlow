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

  //Configuring the External IdP on MiniOrange Dashboard
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

    // Capture OAuth callback URL and save to file
    cy.get('[data-testid="oauthcallbackurl-input"]').invoke('val')
      .then((cbUrl) => {
        const oauthCallbackUrl = cbUrl.trim();
        cy.log('Captured OAuth Callback URL: ' + oauthCallbackUrl);
        //cy.wrap(cbURL).as(oauthCallbackURL) WRAPPING
        // cy.get('selector').type('@oauthCallbackURL'); UNWRAPPING

        // Save to file (fixtures folder)
        cy.writeFile('cypress/fixtures/oauthData.json', { oauthCallbackUrl });
      }); 

    // Save IDP Configuration
    cy.get('[data-testid="save-button"]').click();
    cy.contains('External Identity Providers').should('be.visible');
    }); 

// ---------------------------------------------------------------------------------------------------------

//Congiguring WordPress
  it('Configure WordPress Plugin using saved OAuth data', () => {

    // Read the saved OAuth callback URL from file
    cy.readFile('cypress/fixtures/oauthData.json').then((data) => {
      const callbackUrl = data.oauthCallbackUrl;
      cy.log('Using saved Callback URL: ' + callbackUrl);

      cy.origin('https://dev-wordpress-provisioning.pantheonsite.io', { args: { callbackUrl } }, ({ callbackUrl }) => {
        cy.log('Visiting WordPress Admin Login Page');
        cy.visit('/wp-login.php/');  
        cy.wait(2000); 
        
        cy.get('.pds-button', { timeout: 15000 })
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });

        cy.location('href', { timeout: 20000 });
        cy.log('WordPress login page loaded successfully');

        // WordPress Admin Login
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
        cy.get('button[name="update_client_button"][value="update_client_app"]').click();

        //Capture all OAuth details from WordPress plugin and save to file
        const oauthData = {};

        // Client ID
        cy.log('Attempting to capture Client ID...');
        cy.contains('tr', 'Client ID:', { timeout: 15000 })
          .find('td.endpoint')
          .should('exist') 
          .invoke('text')
          .then((t) => {
            oauthData.clientId = t.trim() || 'N/A';
            cy.log('Captured Client ID: ' + oauthData.clientId);
          })  

        // Client Secret
        cy.log('Attempting to capture Client Secret...');
        cy.contains('tr', 'Client Secret:', { timeout: 15000 })
          .then(($tr) => {
            const eye = $tr.find('#eye_icon');
            if (eye.length) {
              cy.wrap(eye).click({ force: true });
              cy.log('Clicked eye icon to reveal client secret');
            } else {
              cy.log('Eye icon not found; attempting to read input directly');
            }

            cy.wrap($tr)
              .find('input#client-secret', { timeout: 15000 })
              .should('exist')
              .should(($in) => {
                const v = $in.attr('value');
                if (!v || v.trim() === '') {
                  throw new Error('client-secret value not present yet');
                }
              })
              .invoke('val')
              .then((val) => {
                oauthData.clientSecret = (val || '').trim() || 'N/A';
                cy.log('Captured Client Secret: ' + oauthData.clientSecret);
              });
          })


        // Authorization Endpoint
        cy.log('Attempting to capture Authorization Endpoint...');
        cy.contains('tr', 'Authorization Endpoint:', { timeout: 15000 })
          .find('td.endpoint')
          .should('exist')
          .invoke('text')
          .then((t) => {
            oauthData.authEndpoint = t.trim() || 'N/A';
            cy.log('Captured Auth Endpoint: ' + oauthData.authEndpoint);
          })

        // Token Endpoint
        cy.log('Attempting to capture Token Endpoint...');
        cy.contains('tr', 'Token Endpoint:', { timeout: 15000 })
          .find('td.endpoint')
          .should('exist')
          .invoke('text')
          .then((t) => {
            oauthData.tokenEndpoint = t.trim() || 'N/A';
            cy.log('Captured Token Endpoint: ' + oauthData.tokenEndpoint);
          })

        // UserInfo Endpoint
      cy.log('Capturing Userinfo Endpoint...');
      cy.get('tr')
        .contains(/(Userinfo Endpoint:|Get User Info Endpoint:)/i, { timeout: 15000 })
        .parent('tr')
        .find('td.endpoint')
        .invoke('text')
        .then((userInfo) => {
          const trimmedUserInfo = userInfo.trim();
          cy.log('Captured Userinfo Endpoint:', trimmedUserInfo);
          oauthData.userinfoEndpoint = trimmedUserInfo || 'N/A';
        });

        // Scopes / Profile
        cy.log('Attempting to capture Scopes...');
        cy.contains('tr', 'Scopes:', { timeout: 15000 })
          .find('td.endpoint')
          .should('exist')
          .invoke('text')
          .then((t) => {
            oauthData.profile = t.trim() || 'N/A';
            cy.log('Captured Scopes: ' + oauthData.profile);
          })
        
        // Write merged data back to file
        cy.then(() => {
          cy.readFile('cypress/fixtures/oauthData.json', { timeout: 5000 })
            .then((existing = {}) => {
              const merged = Object.assign({}, existing, oauthData);
              cy.writeFile('cypress/fixtures/oauthData.json', merged);
              cy.log('Saved oauthData.json: ' + JSON.stringify(merged, null, 2));
            })
            .then(null, (err) => {
              cy.writeFile('cypress/fixtures/oauthData.json', oauthData);
              cy.log('oauthData.json not found, wrote new file: ' + JSON.stringify(oauthData, null, 2));
            });
        });

      });

    });
  });


// ---------------------------------------------------------------------------------------------------------
// Completing the IDP configuration, Then Creating the User, Creating App, Creating Policies
  it('Reopen miniOrange OAuth Provider page', () => {
    cy.fixture('oauthData.json').then((oauthData) => {

      // Reopen miniOrange domain safely
      // Visit the same configuration page directly
        cy.visit('https://bhargavpardikar.miniorange.in/moas/admin/customer/customoauthconfiguration?cardId=OAuth%20Provider');

        // Optionally, re-login if session expired
        cy.get('body').then(($body) => {
          if ($body.find('#username').length) {
            cy.get('#username').type('bhargav.pardikar@xecurify.com');
            cy.get('#loginbutton').click();
            cy.get('#plaintextPassword').type('demouser');
            cy.get('#loginbutton').click();
            cy.get('.btn.btn-dark.w-50').click();
            cy.get('.btn.btn-light').click();
            cy.get('.btn.btn-light').click();
          }
        });

        cy.window().then((win) => {
    win.location.href = 'https://bhargavpardikar.miniorange.in/moas/admin/customer/customoauthconfiguration?cardId=OAuth%20Provider';
      });
        // Now you’re back on the same configuration page
        cy.log('Reopened OAuth Provider configuration page');

        // Example: Fill Client ID / Secret fields from the saved file
        cy.wait(2000);
        cy.get('[data-testid="displayname-input"]').clear({force:true}).type('WordPressTestIdP');
        cy.get('[data-testid="clientid-input"]').type(oauthData.clientId);
        cy.get('[data-testid="clientsecret-input"]').type(oauthData.clientSecret);
        cy.get('[data-testid="authorizeendpoint-input"]').type(oauthData.authEndpoint);
        cy.get('[data-testid="tokenendpoint-input"]').type(oauthData.tokenEndpoint);
        cy.get('[data-testid="userinfoendpoint-input"]').type(oauthData.userinfoEndpoint);
        cy.get('[data-testid="scope-input"]').type(oauthData.profile);

        //Save Button
        cy.get('[data-testid="save-button"]').click();
        cy.wait(10000);

        cy.get('[data-testid="search-bar"]').type('WordPressTestIdP').wait(2000).type('{enter}');
        cy.get('button[data-testid="actions-button-WordPressTestIdP"]').click();
        cy.get('[data-testid="make_default-menu-item"]').click();
        cy.contains('button.btn.mo-btn-primary.add-app', 'Make Default').click({ force: true });
        cy.wait(5000);

    });
});


// ---------------------------------------------------------------------------------------------------------
// -------------------------- CREATE USER --------------------------
  it('Create a new user successfully', () => {
    
    loginToDashboard(); 
    cy.log('Navigating to Users Tab');
    cy.get('#users-menu0').click(); // ID placeholder - confirm actual selector
    cy.get('a[href="/moas/admin/customer/enduseradminlist"]').click(); 
    // Assertion - Verify User List Page
    //cy.get('h4').should('contain.text', 'Users');

    cy.log('Clicking Add User');
    cy.get('#button2').click(); // Verify ID in your DOM

    // Fill user details
    cy.log('Filling User Details');
    cy.get('#primaryEmail').type('brokerflow@gmail.com'); // Email
    cy.get('#username').clear().type('brokerflow'); // Username
    cy.get('#fname').type('broker');
    cy.get('#lname').type('flow');
    cy.get('#primaryPhone').type('9876543210');
    cy.get('#password').type('Password@123');     

    cy.get('[name="save"]').click(); // Create User

    // Assertion - Verify Success Message
    //cy.get('body').should('contain.text', 'EndUser is added successfully');
  });



// ---------------------------------------------------------------------------------------------------------
// --------------------------CREATE APP --------------------------
  it('Create a new Custom JWT App', () => {
    
    loginToDashboard(); 
    cy.log('Navigating to Apps Tab');
    cy.get('a[href="/moas/admin/customer/apps"]').click(); //no other selector  // PUT ACTUAL SELECTOR HERE

    // Assertion - Verify Apps page
    //cy.get('h4').should('contain.text', 'Applications');

    cy.log('Click Add Application');
    cy.get('[data-testid="add-app-button"]').click(); // PUT ACTUAL SELECTOR HERE
    cy.wait(1000); 

    // Select JWT App
    cy.get('[data-testid="search-bar"]').type('JWT'); // No cy.contains — replace with correct selector

    // Select Custom JWT App  
    cy.get('[data-testid="jwt-app-jwt-app-card"]').click(); // Modify based on HTML

    cy.log('Filling Application Details');
    cy.get('[data-testid="appname-input"]').type('BrokerCypress'); // PUT correct selector
    cy.get('[data-testid="redirecturls-field"]').type('https://jwt.io/'); // PUT correct selector

    cy.get('[data-testid="login_options-tab"]').click(); // open Login Options tab
    cy.get('[data-testid="identitysource.displayname-dropdown"]').wait(2000).select('WordPressTestIdP'); // select IDP option

    cy.get('[data-testid="save-button"]').click(); // Save App
    //cy.get('body').should('contain.text', 'Application created successfully');
  });


// ---------------------------------------------------------------------------------------------------------
// -------------------------- CREATE POLICY --------------------------
  it('Create a new App Login Policy', () => {
    loginToDashboard();
    cy.log('Navigating to Policies Tab');
    cy.get('[data-testid="policy-menu-link"]').click(); // still needs unique selector for sidebar Policies
    cy.get('[data-testid="sidebar-app-login-policy-link"]').click();

    // Assertion - Verify Policy Page
    // cy.get('h4').should('contain.text', 'App Login Policies');

    cy.log('Clicking Add Policy');
    cy.get('[data-testid="addpolicy-button"]').click();

    cy.get('#react-select-2-input').click({ force: true }).type('BrokerCypress', { delay: 100 }).wait(2000).type('{enter}'); // select app name 

    cy.get('#react-select-3-input').click({ force: true });

  // Type the group name to search
    cy.get('#react-select-3-input').type('DEFAULT', { delay: 100 });
  // Wait for options to load (React Select needs time)
    cy.wait(2000);
  // Select the visible matching option
    cy.get('div[id*="-option"]').contains('DEFAULT').click();

    cy.get('[data-testid="submit-policy-button"]').click();
    // cy.get('body').should('contain.text', 'App Login Policy updated successfully');
  });

          
// ---------------------------------------------------------------------------------------------------------
// -------------------------- COPY AND USE SSO URL --------------------------
  it('Copy SSO URL from app and validate JWT flow', () => {
    
    loginToDashboard();
    cy.log('Navigating to Apps Tab');
    cy.get('a[href="/moas/admin/customer/apps"]').click();

    cy.log('Searching for JWT App');
    cy.get('[data-testid="search-input"]').type('BrokerCypress').wait(2000).type('{enter}');

    cy.log('Opening app menu');
    cy.get('[data-testid="actions-button-BrokerCypress"]').click({force:true});   // open action menu
    cy.get('[data-testid="edit-menu-item"]').click({force:true}); // Click Edit

    cy.log('Navigating to Endpoints tab');
    cy.get('[data-testid="endpoints-tab"]').click();
    cy.wait(1000); 

    cy.log('Copying SSO URL');

    // Click first “copy to clipboard” button
    cy.get('button[aria-label="copy to clipboard"]').eq(1).click({ force: true });
    cy.wait(2000);   

    // Sign out
    cy.get('[data-testid="navbar-item-profile"]').click();
    cy.get('[data-testid="signout-link"]').click();
    cy.wait(1000);                

    // Read the copied SSO URL from clipboard
    cy.window().then((win) => {
      return win.navigator.clipboard.readText();
    }).then((ssoUrl) => {
      cy.log('SSO URL:', ssoUrl);

      // Ignore uncaught exceptions (React/app errors)
      cy.on('uncaught:exception', () => false);

      //  Visit the copied SSO URL directly
      cy.visit(ssoUrl, { failOnStatusCode: false });

      //  Handle WordPress login
      cy.get('.pds-button', { timeout: 15000 })
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

      cy.location('href', { timeout: 20000 });
      cy.log('WordPress login page loaded successfully');

      cy.get('#user_login').should('be.visible').type('bhargav.pardikar@xecurify.com');
      cy.get('#user_pass').should('be.visible').type('Bhargav@26');  
      cy.get('#wp-submit').click();
      cy.contains('button', 'Submit Consent').click();
      cy.wait(500);
      cy.get('button.use-hash-warning_button__VNwMI').click();
      
      //  Verify JWT.io page loaded
      cy.url().should('include', 'jwt.io');
      cy.get('h1').should('contain.text', 'JSON Web Token (JWT) Debugger');
      cy.get('body').should('contain.text', 'Decoded Payload');
    });

  });

});                                            




// ------------------------------------END---------------------------------------------------