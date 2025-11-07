import adduser from '../../../Pages/Flows/adduser';
import Login  from '../../../Pages/Flows/loginpage'; 

describe('Adding User', () =>{
    let testData;

    before(() => {
        cy.fixture('login').then((data) => {
        testData=data;
        });
    });  

    it('adding a user' , () => {
        Login.visit();
        Login.performlogin(testData[0].username , testData[0].password);
            cy.get('.btn.btn-dark.w-50').click();
            cy.get('.btn.btn-light').click();
            cy.get('.btn.btn-light').click();

        adduser.gotoUserstab();
        adduser.createUser(
            testData[1].email,
            testData[1].username,
            testData[1].firstname,
            testData[1].lastname,
            testData[1].phone,
            testData[1].userpassword
        ); 
        adduser.checkUser();

        
    });
});