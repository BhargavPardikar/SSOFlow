import addgroup from "../../../Pages/Flows/addgroup";
import Login from "../../../Pages/Flows/loginpage";

describe('Adding Group' , () => {
    let testData;
    
    before(() =>{
        cy.fixture('login').then((data) => {
            testData = data;
        });
    });

    it('Adding a group' , () => {
                Login.visit();
                Login.performlogin(testData[0].username , testData[0].password);
                    cy.get('.btn.btn-dark.w-50').click();
                    cy.get('.btn.btn-light').click();
                    cy.get('.btn.btn-light').click();
        
        addgroup.gotoGroupstab(testData[2].groupname);

    })

});   

