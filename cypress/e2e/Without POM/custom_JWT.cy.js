describe('miniOrange Automation Flows', () => {

  // -------------------------- COMMON LOGIN FUNCTION --------------------------
  function loginToDashboard() {
    cy.visit('https://bhargav.xecurify.com/moas/login');

    cy.get('#username').type('bhargavpp2026@gmail.com'); // Enter Username
    cy.get('#loginbutton').click();
    cy.get('#plaintextPassword').type('NG1639RQUH22IX'); // Enter Password
    cy.get('#loginbutton').click();

    // Assertion - Verify dashboard loaded
    cy.url().should('eq', 'https://bhargav.xecurify.com/moas/admin/customer/home');
    cy.get('.btn.btn-dark.w-50').click();
    cy.get('.btn.btn-light').click();
    cy.get('.btn.btn-light').click();
    //cy.get('h5').should('contain.text', 'Get Started in Minutes');// Verify landing section
  }

  // -------------------------- BEFORE EACH --------------------------
  beforeEach(() => {
    cy.log('Running BeforeEach - Logging in to miniOrange Dashboard');
    loginToDashboard();
  });

  // -------------------------- FLOW 1: LOGIN USER --------------------------
  it('Login user with valid credentials', () => {
    cy.log('Verifying successful login to Dashboard');
    cy.url().should('include', '/customer/home');
    // cy.get('h5').should('contain.text', 'Get Started in Minutes');
  });

  // -------------------------- FLOW 2: CREATE USER --------------------------
  it('Create a new user successfully', () => {
    cy.log('Navigating to Users Tab');
    cy.get('#users-menu0').click(); // ID placeholder - confirm actual selector
    cy.get('a[href="/moas/admin/customer/enduseradminlist"]').click(); 
    // Assertion - Verify User List Page
    //cy.get('h4').should('contain.text', 'Users');

    cy.log('Clicking Add User');
    cy.get('#button2').click(); // Verify ID in your DOM

    // Fill user details
    cy.log('Filling User Details');
    cy.get('#primaryEmail').type('cypresstestuser123@gmail.com'); // Email
    cy.get('#username').clear().type('cypresstestuser123'); // Username
    cy.get('#fname').type('Cypress');
    cy.get('#lname').type('TestUser');
    cy.get('#primaryPhone').type('9876543210');
    cy.get('#password').type('Password@123');     

    cy.get('[name="save"]').click(); // Create User

    // Assertion - Verify Success Message
    //cy.get('body').should('contain.text', 'EndUser is added successfully');
  });

  // -------------------------- FLOW 3: CREATE APP --------------------------
  it('Create a new Custom JWT App', () => {
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
    cy.get('[data-testid="appname-input"]').type('TestJWTCYPRESS'); // PUT correct selector
    cy.get('[data-testid="redirecturls-field"]').type('https://jwt.io/'); // PUT correct selector

    cy.get('[data-testid="login_options-tab"]').click(); // open Login Options tab
    cy.get('[data-testid="identitysource.displayname-dropdown"]').select('MINIORANGE'); // select IDP option

    cy.get('[data-testid="save-button"]').click(); // Save App
    //cy.get('body').should('contain.text', 'Application created successfully');
  });

  // -------------------------- FLOW 4: CREATE POLICY --------------------------
it('Create a new App Login Policy', () => {
  cy.log('Navigating to Policies Tab');
  cy.get('[data-testid="policy-menu-link"]').click(); // still needs unique selector for sidebar Policies
  cy.get('[data-testid="sidebar-app-login-policy-link"]').click();

  // Assertion - Verify Policy Page
  // cy.get('h4').should('contain.text', 'App Login Policies');

  cy.log('Clicking Add Policy');
  cy.get('[data-testid="addpolicy-button"]').click();

  cy.get('#react-select-2-input').click({ force: true }).type('TestJWTCYPRESS', { delay: 100 }).wait(2000).type('{enter}'); // select app name 

  cy.get('#react-select-3-input').click({ force: true });

// Type the group name to search
  cy.get('#react-select-3-input').type('DEFAULT', { delay: 100 });
// Wait for options to load (React Select needs time)
  cy.wait(2000);
// Select the visible matching option
  cy.get('div[id*="-option"]').contains('DEFAULT').click();

  // cy.get('[data-testid="policyName"]').type('testuser_policyCYPRESS');
  // cy.get('[data-testid="firstFactorDropdown"]').click();
  // cy.get('li[data-value="Password"]').click();

  cy.get('[data-testid="submit-policy-button"]').click();
  // cy.get('body').should('contain.text', 'App Login Policy updated successfully');
});


// -------------------------- FLOW 5: COPY AND USE SSO URL --------------------------
it.only('Copy SSO URL from app and validate JWT flow', () => {
  cy.log('Navigating to Apps Tab');
  cy.get('a[href="/moas/admin/customer/apps"]').click();

  cy.log('Searching for JWT App');
  cy.get('[data-testid="search-input"]').type('TestJWTCYPRESS').wait(2000).type('{enter}');

  cy.log('Opening app menu');
  cy.get('[data-testid=actions-button-TestJWTCYPRESS]').click();
  cy.get('[data-testid="actions-button-TestJWTCYPRESS"]').click({force:true});   // open action menu
  cy.get('[data-testid="edit-menu-item"]').click({force:true}); // Click Edit

  cy.log('Navigating to Endpoints tab');
  cy.get('[data-testid="endpoints-tab"]').click();
  cy.wait(1000); 

  cy.log('Copying SSO URL');
// Click the first copy button
  cy.get('button[aria-label="copy to clipboard"]').first().click({ force: true });
  cy.wait(2000)
  cy.get('[data-testid="navbar-item-profile"]').click();
  cy.get('[data-testid="signout-link"]').click();
  cy.wait(1000)

cy.window().then((win) => {
  return win.navigator.clipboard.readText();
}).then((ssoUrl) => {
  cy.log('SSO URL:', ssoUrl);

  // Step 4: Handle possible app-level or React exceptions
  cy.on('uncaught:exception', () => false);

  // Step 5: Visit the copied SSO link directly
  cy.visit(ssoUrl, { failOnStatusCode: false });


  // Assertion - Verify redirected to login form
  //cy.get('[data-testid="username"]').should('be.visible');

  // Enter crede  ntials again
    cy.get('#username').type('cypresstestuser123@gmail.com'); // Enter Username
    cy.get('#loginbutton').click();
    cy.get('#plaintextPassword').type('Password@123'); // Enter Password
    cy.get('#loginbutton').click();
    cy.get('button.use-hash-warning_button__VNwMI').click();

  // Assertion - Verify jwt.io page loaded
  // cy.url().should('include', 'jwt.io');
  // cy.get('h1').should('contain.text', 'JSON Web Token (JWT) Debugger');
  // cy.get('body').should('contain.text', 'Decoded Payload');
});
});
});
