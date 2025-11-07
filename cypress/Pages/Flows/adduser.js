import { AddUser } from "../../Object Repo/Flows/adduser";

class adduser{
    visit(){
        cy.visit('https://bhargavpardikar.miniorange.in/moas/login');
    } 

    gotoUserstab(){
        cy.get(AddUser.userstab).click();
        cy.get(AddUser.userlist).click();
        cy.get(AddUser.adduserbutton).click();
    } 

    createUser(email,user_name,firstname,lastname,phone_number,password){
        cy.get(AddUser.email).type(email);
        cy.get(AddUser.usernameInput).type(user_name);
        cy.get(AddUser.firstname).type(firstname);
        cy.get(AddUser.lastname).type(lastname);
        cy.get(AddUser.phone).type(phone_number);
        cy.get(AddUser.passwordInput).type(password);
        cy.get(AddUser.save).click();
    } 

    // checkUser(){
    //     cy.contains('An Enduser is added successfully').should('be.visible');
    // } 


}

export default new adduser();