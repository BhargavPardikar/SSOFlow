import { AddGroup } from "../../Object Repo/Flows/addgroup";

class addgroup{
    visit(){
        cy.visit('https://bhargavpardikar.miniorange.in/moas/login');
    }  

    gotoGroupstab(groupname){
        cy.contains(AddGroup.groupstab,{ timeout: 10000 }).click();
        cy.get(AddGroup.managegroups, { timeout: 10000 }).click();
        cy.get(AddGroup.creategroup, { timeout: 10000 }).click();
        cy.get(AddGroup.groupname, { timeout: 10000 }).type(groupname);
        cy.get(AddGroup.save).click();
    }




};

export default new addgroup();