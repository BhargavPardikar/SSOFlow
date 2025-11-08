import { AddPolicy } from "../../../Object Repo/DefaultIDP/CreatePolicy/addPolicySelectors"; 

class CreatePolicy{
    //Considering the flow of creating policy is, during creating the app itself!! 
    //The name of the app gets auto-entered in Application name input field, 
    //Just Enter the Group name and policy name 
    
    makepolicy () {
        cy.get(AddPolicy.selectgroup).click({ force: true }).type('Group1{enter}'); //Group1 is created here! Enter your group name or else DEFAULT
        cy.get(AddPolicy.save).click();
    }


}

export default new CreatePolicy(); 