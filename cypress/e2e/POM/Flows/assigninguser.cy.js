import Login from '../../../Pages/Flows/loginpage';
import adduser from '../../../Pages/Flows/adduser';
import addgroup from '../../../Pages/Flows/addgroup'; 
import assinginguser from '../../../Pages/Flows/assinginguser';

describe('Assigning User to Group' , () => {
    let testData;

    before(() => {
        cy.fixture('login').then((data) => {
            testData = data;
        });
    });

    it('Assiging user to group' , () => {
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
        //adduser.checkUser();

        //cy.get('#users-menu0').click();
        //cy.visit('https://bhargavpardikar.miniorange.in/moas/admin/customer/getgroups'); 
        addgroup.gotoGroupstab(testData[2].groupname);
        
        
        assinginguser.searchGroup();
        assinginguser.searchusers();

        



            
        
    })


});