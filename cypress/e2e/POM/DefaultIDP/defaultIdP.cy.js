import configureidp from "../../../Pages/DefaultIDP/ConfiureIDP/ConfigureIdP"; 
import WordPressConfigureIdp from "../../../Pages/DefaultIDP/ConfiureIDP/WordpressIdP"; 
import Login from "../../../Pages/Flows/loginpage" ;

//No Hard Coded Value! Only call through json, and Follow conventions

describe('Creating WordPress as an IdP' , () =>{
    let testData;
    before(() => {
        cy.fixture('login').then((data) => {
            testData=data;
        });
    })

    it('WordPress as an OAuth IdP' , () => {
        Login.visit();
        Login.performlogin(testData[0].username,testData[0].password);
            cy.get('.btn.btn-dark.w-50').click();
            cy.get('.btn.btn-light').click();
            cy.get('.btn.btn-light').click();
        
        
        configureidp.addidp(testData[4].idptype, testData[4].idpname);
        configureidp.copyredirecturl();

        WordPressConfigureIdp.visit();
        WordPressConfigureIdp.wordpresslogin(testData[0].username, testData[0].password);
        WordPressConfigureIdp.confiureplugin();
        WordPressConfigureIdp.copyingCredentials().then((urls) => {
            cy.log('Captured URLs:', JSON.stringify(urls));
            configureidp.visitidppage();
            configureidp.pastingtheurls(urls, testData[0].username, testData[0].password);
            configureidp.checkidp(); 
        });

    });
});