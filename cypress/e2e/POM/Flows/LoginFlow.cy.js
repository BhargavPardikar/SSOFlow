import Login from '../../../Pages/Flows/loginpage';

describe('Check Login' , () => {
    let testData; 

    before(() => {
            cy.fixture('login').then((data) => {
                testData = data;
            });
    });

    it('Valid Credentials', () => {
        Login.visit();
        Login.performlogin(testData[0].username, testData[0].password);
            cy.get('.btn.btn-dark.w-50').click();
            cy.get('.btn.btn-light').click();
            cy.get('.btn.btn-light').click();
        //Login.checkLogin();
    });
});



