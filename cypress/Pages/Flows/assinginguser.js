import { AssignUser } from "../../Object Repo/Flows/assigning";
import { AddGroup } from "../../Object Repo/Flows/addgroup";

class assignUser{
    searchGroup(groupname){
        cy.get(AddGroup.managegroups, { timeout: 10000 }).click();
        cy.get(AssignUser.searchgroup).type(groupname);
        cy.get(AssignUser.select).click({force : true});
        cy.contains(AssignUser.assign).click();
    }

    searchusers(){
        cy.get(AssignUser.checkbox).check();
        cy.get(AssignUser.assigntogroup).select('Assign to Group');;
        cy.get(AssignUser.apply).click(); // check the box in that row
        
    }
}; 

export default new assignUser();