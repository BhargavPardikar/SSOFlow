import Login from "../../../../cypress/Pages/Flows/loginpage" ; 
import  adduser  from "../../../Pages/Flows/adduser";
import  addgroup  from "../../../Pages/Flows/addgroup" ;
import  assinginguser  from "../../../Pages/Flows/assinginguser"; 
import  CreatePolicy  from "../../../Pages/DefaultIDP/CreatePolicy/addPolicy" ; 
import  configureidp  from "../../../Pages/DefaultIDP/ConfiureIDP/miniOrangeIdP/ConfigureIdP" ;  
import  WordPressConfigureIdp  from "../../../Pages/DefaultIDP/ConfiureIDP/WordPressIDP/WordpressIdP" ;
import  JWTApp  from "../../../Pages/DefaultIDP_Flow02/ConfigureJWTApp/ConfigureJWTApp" ; 
import  TestSSOFlow from "../../../../cypress/Pages/DefaultIDP_Flow02/ConfigureJWTApp/TestSSO/TestSSO" ;


describe('WordPress as an Default IDP' , () => {
    let testData;
    before(() => {
        cy.fixture('login').then((data) => {
            testData=data;
        });
    }) ;    

    it('User and App Policy in Non Default group' , () => {

        // login to miniorange dashboard
        Login.visit(testData[0].loginurl);
        Login.performlogin(testData[0].username,testData[0].password);
        Login.ignorebuttons();

        //Configure WordPress as an External IDP 
        configureidp.addidp(testData[4].idptype, testData[4].idpname);
        configureidp.copyredirecturl();  
        WordPressConfigureIdp.visit(testData[3].wordpressurl);
        WordPressConfigureIdp.wordpresslogin(testData[0].username, testData[0].password);
        WordPressConfigureIdp.confiureplugin();
        WordPressConfigureIdp.copyingCredentials().then((urls) => {
            cy.log('Captured URLs:', JSON.stringify(urls));
            cy.visit('https://bhargavpardikar.miniorange.in/moas/admin/customer/customoauthconfiguration?cardId=OAuth%20Provider') ;
            //Login.reloginIfNeeded(testData[0].username,testData[0].password,testData[4].idpurl);
            //configureidp.visitidppage(testData[5].idpurl);
            configureidp.pastingtheurls(urls,testData[4].idpname);
            cy.wait(5000); 
            configureidp.checkidp(); 
        }); 
        configureidp.makedefault(testData[4].idpname);

        //Add User
        adduser.gotoUserstab();
        adduser.createUser(
            testData[1].email,
            testData[1].username,
            testData[1].firstname,
            testData[1].lastname,
            testData[1].phone,
            testData[1].userpassword
        ); 

        //Create Group 
        addgroup.gotoGroupstab(testData[2].groupname);
                
          
        //Assign User
        assinginguser.searchGroup(testData[2].groupname); 
        assinginguser.searchusers();  

        //Create App 
        JWTApp.addapp(testData[5].apptype,testData[5].appname,testData[5].jwturl);
        CreatePolicy.makepolicy(testData[3].groupname); 

        //TestSSO 
        TestSSOFlow.copyingurl(); 
        TestSSOFlow.pastingurl();
        TestSSOFlow.checkingflow(testData[1].email,testData[1].userpassword);


    });

}); 


