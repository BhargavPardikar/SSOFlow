describe('miniOrange Automation Flows', () => {

  // -------------------------- COMMON LOGIN FUNCTION --------------------------
  function loginToDashboard() {
    // Visit the base URL
    cy.visit('https://bhargav.xecurify.com/moas/login');

    cy.get('#username').type('bhargavpp2026@gmail.com'); // Enter your username/email

    // Step 2: Click Login to go to password step
    cy.get('#loginbutton').click();

    // Step 3: Enter password
    cy.get('#plaintextPassword').type('NG1639RQUH22IX');   // Enter your password

    // Step 4: Click Login again
    cy.get('#loginbutton').click();

    // Step 5: Verify dashboard is loaded
    cy.url().should('eq', 'https://bhargav.xecurify.com/moas/admin/customer/home');
    cy.get('.btn.btn-dark.w-50').click();
    cy.get('.btn.btn-light').click();
    cy.get('.btn.btn-light').click();                 

  cy.contains('Get Started in Minutes').should('be.visible'); //Assertion 1
  }  


  // FLOW 1: LOGIN USER 
  it('Login user with valid credentials', () => {

    // Perform Login
    loginToDashboard();

    // Assertion 2
    // cy.get('greeting-message').should('contain.text', 'Get Started in Minutes');
    // cy.contains('Add Identity Source').should('be.visible');
  });


  // FLOW 2: CREATE USER 
  it('Create a new user', () => {

    // Login first to ensure independence
    loginToDashboard();

    // Step 1: Navigate to User tab
    cy.get('#users-menu0').click(); 

    // Step 2: Click on "User List"
    cy.get('#sidebar-user-list').click(); 

    // Step 3: Click "Add User"
    cy.get('#button2').click();

    // Step 4: Fill Personal Details
    cy.get('#primaryEmail').type('cypresstestuser@gmail.com'); // Email
    cy.get('#username').type('cypresstestuser'); // Username
    cy.get('#fname').type('Cypress'); // First Name
    cy.get('#lname').type('TestUser'); // Last Name


    // Step 6: Enter Phone Number
    cy.get('#primaryPhone').type('9876543210'); 

    // Step 7: Enter Password
    cy.get('#password').type('Password@123');

    // Step 8: Click "Create User"
    cy.get('[name="save"]').click();

    // Assertion 3 
    // cy.contains('User created successfully').should('be.visible');
  });


  // FLOW 3: CREATE GROUP 
  it('Create a new group', () => {

    // Login first to ensure independence
    loginToDashboard();

    // Step 1: Navigate to Groups tab
    cy.get("[data-testid='groups-menu-link']").click();  

    // Step 2: Click "Manage Groups"
    cy.get('#sidebar-manage-groups').click();

    // Step 3: Click "Create Group"
    cy.get('a[href="creategroup"]').click();

    // Step 4: Enter group name
    cy.get('#groupName').type('CypressTestGroup');

    // Step 5: Click "Create Group"
    cy.get('#save').click();

    // Assertion 4
    // cy.contains('Group created successfully').should('be.visible');
  });


  // FLOW 4: ADD USER TO GROUP
  it('Add a user to a group', () => {

    // Login first to ensure independence
    loginToDashboard();

    // Step 1: Navigate to Groups → Manage Groups
    cy.get("[data-testid='groups-menu-link']").click();
    cy.get('a[href="/moas/admin/customer/getgroups"]').click();

    // Step 2: Click "Select" button for the group //Cant test the <select> tag
    cy.contains('tr', 'CypressTestGroup').within(() => {
  cy.get('#dropdownMenuGrp').click();  
});

    // Step 3: Click "Assign Users"
    cy.contains('a', 'Assign Users').click();
     


    // Step 4: Select user to assign //Error got here
    cy.contains('tr', 'guitar@admin.com')   
  .within(() => {
    cy.get('.usercheckbox').check();  // check the box in that row
  });


  //AI from here
    // Step 1: Select "Assign to Group" option from the dropdown
cy.get('#bulkactionselect').select('Assign to Group');  // or select('assigntogroup')

// Step 2: Verify that the correct value was selected
cy.get('#bulkactionselect').should('have.value', 'assigntogroup');

// Step 3: Click the "Apply" button (after selecting)
cy.contains('a', 'Apply').click();

// Step 4: Verify success popup appears
cy.contains('Group is updated successfully').should('be.visible');

    // Assertion 5
    // cy.get('#manageGroupsSubtab').click();
    // cy.get('#userCountField').should('contain.text', '2');
  }); 

  // //add customer profile field 
  // loginToDashboard();
  //     cy.get('#users-menu0').click(); 

  //   // Step 2: Click on "User List"
  //   cy.get('#sidebar-user-list').click(); 
  //   cy.get('a[href="/moas/admin/customer/customattributesmapping"]');

});
