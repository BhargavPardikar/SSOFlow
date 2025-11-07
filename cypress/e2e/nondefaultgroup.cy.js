//Login to Dashboard function
function loginToDashboard() {
    cy.visit('https://bhargavpardikar.miniorange.in/moas/login');
    cy.get('#username').type('bhargav.pardikar@xecurify.com'); // Enter Username
    cy.get('#loginbutton').click();
    cy.get('#plaintextPassword').type('Bhargav@26'); // Enter Password  
    cy.get('#loginbutton').click(); 

    // Assertion - Verify dashboard loaded
    cy.url().should('eq', 'https://bhargavpardikar.miniorange.in/moas/admin/customer/home');
    cy.get('.btn.btn-dark.w-50').click(); 
    cy.get('.btn.btn-light').click(); 
    cy.get('.btn.btn-light').click();
    cy.contains('Get started in minutes').should('be.visible');
    cy.log('Logged in and landed on dashboard');
}      



describe('SSO Flow keeping User and Policy in Non Default Group', () => {
    const wordpressUrl = 'https://dev-bhargavsp.pantheonsite.io';
    const miniorangeUrl = 'https://bhargavpardikar.miniorange.in';
    
    //Configuring the External IdP on MiniOrange Dashboard
    it('Login in MiniOrange Dashboard and capture OAuth Callback URL', () => {
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
    //     cy.log('clicked on dropdown button'); 
    //     cy.get('[data-testid="search-bar"]').type('OAuth').wait(2000).type('{enter}'); //Search for oauth 
    //     cy.log('selected the OAuth');

    //     //Selecting the OAuth IDP
    //     cy.log('Selecting the OAuth IDP');
    //     cy.get('[data-testid="oauth-provider-oauth-idp-card"]').click();
    //     cy.contains('OAuth Identity Provider').should('be.visible');
    //     cy.log('display page opens');     
    
    //     //Filling the Details of IDP
    //     cy.log('Fill Display Name for IdP');
    //     cy.get('[data-testid="displayname-input"]').clear().type('WordPressTestIdP'); // named the idp
    //     cy.log('Copy OAuth Callback URL - click copy button and store to alias'); 

    //     cy.get('[data-testid="oauthcallbackurl-input"]')
    //         .invoke('val')
    //         .then((callbackURL) => {
    //             cy.wrap(callbackURL).as('callbackURL');
    //         });

    //     // Visiting WordPress Admin Dashboard 
    //     cy.get('@callbackURL').then((callbackURL) => {
    //         return cy.origin(
    //             'https://dev-wordpress-provisioning.pantheonsite.io',
    //             { args: { callbackURL } },
    //             ({ callbackURL }) => {

    //                 cy.log('Visiting WordPress Admin Login Page');
    //                 cy.visit('/wp-login.php/');
    //                 cy.wait(2000);

    //                 cy.get('.pds-button', { timeout: 15000 })
    //                     .scrollIntoView()
    //                     .should('be.visible')
    //                     .click({ force: true });

    //                 cy.location('href', { timeout: 20000 });
    //                 cy.log('WordPress login page loaded successfully');

    //                 // WordPress Admin Login
    //                 cy.get('#user_login').should('be.visible').type('bhargav.pardikar@xecurify.com');
    //                 cy.get('#user_pass').should('be.visible').type('Bhargav@26');
    //                 cy.get('#wp-submit').click();

    //                 cy.url().should('include', 'wp-admin');
    //                 cy.log('Logged in as WordPress Admin'); 

    //                 //Creating a user in WordPress
    //                 // cy.get('a.menu-icon-users').click();
    //                 // cy.wait(1000);
    //                 // cy.get('a.page-title-action').click();
    //                 // cy.get('#user_login').type('user1');
    //                 // cy.get('#email').type('user1@gmail.com', {delay :100});
    //                 // cy.get('input[name="first_name"]').type('user1');
    //                 // cy.get('input[name="last_name"]').type('cypress');
    //                 // cy.get('#pass1').clear({force : true}).type('Password@123');
    //                 // cy.get('input[name="pw_weak"]').check(); //Ticked the checkbox for weak password
    //                 // cy.get('#createusersub').click();
                    
    //                 //cy.url({ timeout: 20000 }).should('include', 'users.php');
    //                 //cy.wait(2000);

    //                 // Open miniOrange OAuth Plugin
    //                 cy.get('#toplevel_page_mo_oauth_server_settings div.wp-menu-name', { timeout: 20000 })
    //                     .should('be.visible')
    //                     .click({ force: true });
    //                 cy.log('Configuring miniOrange OAuth Server Plugin');

    //                 // Click “Configure App” (orange button)
    //                 cy.get('a.miniorange-oauth-20-server-orange-color', { timeout: 15000 }).first().click({ force: true });
    //                 cy.wait(2000);
    //                 cy.log('Opened the Plugin Dashboard');

    //                 // Update Redirect URI
    //                 cy.get('input[name="redirect_uri"]').clear().type(callbackURL); 
    //                 cy.get('button[name="update_client_button"][value="update_client_app"]').click();
    //                 cy.log('Updated redirect URI in WordPress plugin');

    //                 //Copying all the URLs from here. 
    //                 let urls = {};

    //                 // Client ID
    //                 cy.log('Attempting to capture Client ID...');
    //                 cy.contains('tr', 'Client ID:', { timeout: 15000 })
    //                     .find('td.endpoint')
    //                     .should('exist') 
    //                     .invoke('text')
    //                     .then((t) => {
    //                         urls.clientId = t.trim() || 'N/A';
    //                         cy.log('Captured Client ID: ' + urls.clientId);
    //                     });  

    //                 //Client Secret
    //                 cy.log('Attempting to capture Client Secret...');
    //                 cy.contains('tr', 'Client Secret:', { timeout: 15000 })
    //                     .find('input#client-secret')
    //                     .should('exist') 
    //                     .invoke('val')
    //                     .then((secret) => {
    //                         urls.clientSecret = secret.trim() || 'N/A';
    //                         cy.log('Captured Client Secret: ' + urls.clientSecret);
    //                     });  

    //                 // Authorization Endpoint
    //                 cy.log('Attempting to capture Authorization Endpoint...');
    //                 cy.contains('tr', 'Authorization Endpoint:', { timeout: 15000 })
    //                     .find('td.endpoint')
    //                     .should('exist')
    //                     .invoke('text')
    //                     .then((auth) => {
    //                         urls.auth = auth.trim() || 'N/A';
    //                         cy.log('Captured Auth Endpoint: ' + urls.auth);
    //                     });

    //                 // Token Endpoint
    //                 cy.log('Attempting to capture Token Endpoint...');
    //                 cy.contains('tr', 'Token Endpoint:', { timeout: 15000 })
    //                     .find('td.endpoint')
    //                     .should('exist')
    //                     .invoke('text')
    //                     .then((token) => {
    //                         urls.token = token.trim() || 'N/A';
    //                         cy.log('Captured Token Endpoint: ' + urls.token);
    //                     });

    //                 // UserInfo Endpoint
    //                 cy.log('Capturing Userinfo Endpoint...');
    //                 cy.get('tr')
    //                     .contains(/(Userinfo Endpoint:|Get User Info Endpoint:)/i, { timeout: 15000 })
    //                     .parent('tr')
    //                     .find('td.endpoint')
    //                     .invoke('text')
    //                     .then((userInfo) => {
    //                         urls.userInfo = userInfo.trim();
    //                         cy.log('Captured Userinfo Endpoint: ' + urls.userInfo);
    //                     });

    //                 // Scopes / Profile
    //                 cy.log('Attempting to capture Scopes...');
    //                 cy.contains('tr', 'Scopes:', { timeout: 15000 })
    //                     .find('td.endpoint')
    //                     .should('exist')
    //                     .invoke('text')
    //                     .then((scopes) => {
    //                         urls.scopes = scopes.trim() || 'N/A';
    //                         cy.log('Captured Scopes: ' + urls.scopes);
    //                     })
    //                     .then(() => {
    //                         return cy.wrap(urls);
    //                     });
    //             }
    //         );
    //     })

    //     .then((urls) => {
    //         // Back in MiniOrange, we now have all the captured URLs
    //         cy.log('Captured OAuth URLs:', JSON.stringify(urls));

    //         cy.visit('https://bhargavpardikar.miniorange.in/moas/admin/customer/customoauthconfiguration?cardId=OAuth%20Provider');

    //         // Re-login if session expired
    //         cy.get('body').then(($body) => {
    //             if ($body.find('#username').length) {
    //                 cy.get('#username').type('bhargav.pardikar@xecurify.com');
    //                 cy.get('#loginbutton').click();
    //                 cy.get('#plaintextPassword').type('demouser');
    //                 cy.get('#loginbutton').click();
    //                 cy.get('.btn.btn-dark.w-50').click();
    //                 cy.get('.btn.btn-light').click();
    //                 cy.get('.btn.btn-light').click();
    //             }
    //         });

    //         // Fill in captured values
    //         cy.get('[data-testid="displayname-input"]').clear({ force: true }).type('WordPressTestIdP');
    //         cy.get('[data-testid="clientid-input"]').type(urls.clientId);
    //         cy.get('[data-testid="clientsecret-input"]').type(urls.clientSecret);
    //         cy.get('[data-testid="authorizeendpoint-input"]').type(urls.auth);
    //         cy.get('[data-testid="tokenendpoint-input"]').type(urls.token);
    //         cy.get('[data-testid="userinfoendpoint-input"]').type(urls.userInfo);
    //         cy.get('[data-testid="scope-input"]').type(urls.scopes);

    //         cy.get('[data-testid="save-button"]').click();
    //         cy.wait(5000);
    //         cy.log('Saved OAuth configuration successfully');

            //Making miniOrange as default
            // cy.get('[data-testid="search-bar"]').type(MINIORANGE).type('{enter}');
            // cy.get('[data-testid="actions-button-MINIORANGE"]').click();
            // cy.get('[data-testid="make_default-menu-item"]').cick();
            // cy.contains('button.btn.mo-btn-primary.add-app', 'Make Default').click({ force: true });
            // cy.wait(5000);


            //Creating User
            loginToDashboard();
            cy.get('#users-menu0').click(); 
            cy.get('a[href="/moas/admin/customer/enduseradminlist"]').click();  //Click on "User List"
            cy.get('#button2').click();  // Step 3: Click "Add User"

            cy.get('#primaryEmail').type('user1@gmail.com'); // Email  // Step 4: Fill Personal Details
            cy.get('#username').type('user1'); // Username
            cy.get('#fname').type('user1'); // First Name
            cy.get('#lname').type('cypress'); // Last Name
            cy.get('#primaryPhone').type('9876543210'); 
            cy.get('#password').type('Password@123');

            
            cy.get('[name="save"]').click();  // Step 8: Click "Create User"
            //cy.contains('The EndUser is added successfully').should('be.visible'); 


            //Create Group
            cy.contains('a.nav-link', 'Groups').click();  
            cy.get('a[href="/moas/admin/customer/getgroups"]').click();  // Step 2: Click "Manage Groups" 
            cy.get('a[href="creategroup"]').click();   // Step 3: Click "Create Group"
            cy.get('#groupName').type('Group1');  // Step 4: Enter group name
            cy.get('#save').click();  // Step 5: Click "Create Group"
            cy.contains('New Group is created successfully').should('be.visible');   

        

            // STEP 1: Capture Redirect URL from WordPress
            
                    let redirectURL;
                    let clientId;
                    let clientSecret;
                    let authEndpoint;
                    let tokenEndpoint;
                    let userInfoEndpoint;               

                    // STEP 1️⃣: Capture Redirect URL from WordPress
                    cy.log('Navigating to WordPress Pantheon Admin');
                    cy.origin('https://dev-bhargavsp.pantheonsite.io', () => {
                        cy.visit('/wp-login.php');
                        cy.wait(2000);

                        cy.get('#user_login').type('bhargav.pardikar@xecurify.com');
                        cy.get('#user_pass').type('Bhargav@26');
                        cy.get('#wp-submit').click();

                        cy.url().should('include', 'wp-admin');
                        cy.log('Logged into WordPress Admin');

                        cy.contains('div.wp-menu-name', 'miniOrange OAuth')
                        .should('be.visible')
                        .click({ force: true });

                        cy.get('img.mo_oauth_client_default_app_icon[src*="miniorange.png"]')
                        .should('be.visible')
                        .click({ force: true });

                        cy.get('#callbackurl')
                        .invoke('val')                      
                        .then((url) => {
                            Cypress.env('redirectURL', url); // store globally
                            cy.log('Captured Redirect URL: ' + url);        
                        });
                    });

                    // STEP 2️⃣: Create App in miniOrange Admin
                    cy.then(() => {
                        redirectURL = Cypress.env('redirectURL');
                        cy.log('Using Redirect URL: ' + redirectURL);
                        cy.visit('https://bhargavpardikar.miniorange.in/moas/admin/customer/apps');
                        //cy.get('data-testid=["not-interested-button"]').click();
                        //cy.contains('a.nav-link', 'Apps').click();
                        cy.wait(3000);

                        cy.get('[data-testid="add-app-button"]').click();
                        cy.wait(1000);
                        cy.get('[data-testid="search-bar"]').type('WordPress');
                        cy.get('[data-testid="wordpress-oauth-openid-app-card"]').click();

                        cy.get('[data-testid="clientname-input"]').type('TestWordPressOAuth');
                        cy.get('[data-testid="redirecturlsarray[0].redirecturls-input"]').type(redirectURL);

                        cy.get('[data-testid="clientid-input"]').invoke('val').then((id) => {
                        clientId = id; 
                        Cypress.env('clientId' , id);
                        cy.log('Client ID:' + clientId);            
                        });

                        cy.get('[data-testid="clientsecret-input"]').invoke('val').then((secret) => {
                        clientSecret = secret;
                        Cypress.env('ClientSecret' , secret);
                        cy.log('Client Secret: ' + secret);
                        });

                        cy.get('[data-testid="save-button"]').click();
                        cy.wait(5000);     
                        
                        //Creating Policy here 
                        cy.get('#add-policy-button').click();
                        cy.get('#react-select-2-input').click({ force: true }).type('Group1{enter}');
                        //cy.get('data-testid=["policyname-input"]').type('samplepolicy');
                        cy.get('[data-testid="submit-policy-button"]').click(); 

                        
                        //Copying the Endpoints from here
                        // cy.get('data-testid=["sidebar-apps-link"]').click();
                        // cy.get('[data-testid="search-input"]').type('TestWordPressOAuth');
                        // cy.get('[data-testid="actions-button-TestWordPressOAuth"]').click();
                        // cy.get('[data-testid="edit-menu-item"]').click();

                        cy.get('[data-testid="login_options-tab"]').click();
                        cy.get('#ssoFlows').select('broker');
                        cy.wait(1000); 

                        cy.get('[data-testid="endpoint_tab"]').click();   

                        cy.get('#miniorangeAsBroker').invoke('val').then((val) => {
                        authEndpoint = val;
                        Cypress.env('authEndpoint', val);
                        cy.log('Auth Endpoints' ,authEndpoint);
                        });

                        cy.get('#tokenEndpoints').invoke('val').then((val) => {
                        tokenEndpoint = val;
                        Cypress.env('tokenEndpoint', val);
                        cy.log('Token Endpoint' , tokenEndpoint);
                        });

                        cy.get('#userInfoEndpoints').invoke('val').then((val) => {
                        userInfoEndpoint = val;
                        Cypress.env('userInfoEndpoint', val);
                        cy.log('Userinfo Endpoint' , userInfoEndpoint);
                        });
                    });

                    // STEP 3️⃣: Go back to WordPress and configure plugin
                    cy.then(() => {
                        // 1. Package all required values from Cypress.env() OUTSIDE the cy.origin block directly into 'args'.
                        const args = {
                        auth: Cypress.env('authEndpoint'),
                        token: Cypress.env('tokenEndpoint'),
                        userinfo: Cypress.env('userInfoEndpoint'),
                        id: Cypress.env('clientId'), // Use 'clientId' saved in step 2
                        secret: Cypress.env('clientSecret'), // Use 'clientSecret' saved in step 2
                    };
                    
                    cy.log('Transferring captured endpoints and credentials back to WordPress...');

                    // 2. Pass the 'args' object and destructure them inside the callback
                    cy.origin(wordpressUrl, {args}, ({auth, token, userinfo, id, secret}) => {
                        
                        // IMPORTANT FIX: Ensure there are NO additional const declarations (e.g., const auth = Cypress.env(...)) 
                        // inside this block. The variables (auth, token, etc.) are already available from destructuring.
                        
                        cy.visit('/wp-admin/admin.php?page=mo_oauth_settings');
                        cy.wait(2000);

                        // Navigate to the correct app configuration screen
                        cy.get('img.mo_oauth_client_default_app_icon[src*="miniorange.png"]')
                            .should('be.visible')
                            .click({ force: true });

                        // Use the destructured arguments
                        cy.get('#mo_oauth_custom_app_name').clear().type('TestWordPressOAuth');
                        cy.get('input[name="mo_oauth_client_id"]').clear().type(id);
                        cy.get('#mo_oauth_client_secret').clear().type(secret);
                        cy.get('#mo_oauth_authorizeurl').clear().type(auth);
                        cy.get('#mo_oauth_accesstokenurl').clear().type(token);
                        cy.get('#mo_oauth_resourceownerdetailsurl').clear().type(userinfo);

                        cy.get('input[name="submit"]').click();
                        cy.log('Configuration saved successfully in WordPress!');
                    }); 
        });
                });

        });



        // cy.log('Click Add Application');
        // cy.get('[data-testid="add-app-button"]').click(); // PUT ACTUAL SELECTOR HERE
        // cy.wait(1000); 

        // // Select JWT App
        // cy.get('[data-testid="search-bar"]').type('WordPress'); // No cy.contains — replace with correct selector

        // // Select Custom JWT App  
        // cy.get('[data-testid="wordpress-oauth-openid-app-card"]').click();
        // cy.get('data-testid=["clientname-input"]').type('TestWordPressOAuth');



//});
