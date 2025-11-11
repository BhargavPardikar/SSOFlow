describe('Intercept Continue button redirect', () => {
  it('should intercept the GET call and verify redirect', () => {
    cy.intercept('GET', '**/login.php*').as('continue');
    cy.get('.pds-button').should('be.visible').click({ force: true });
    cy.wait('@continue').then((interception) => {
      expect(interception.response.statusCode).to.eq(304);
      cy.log(' Intercepted redirect to:', interception.request.url);  
    });

    cy.url().should('include', '/login.php');
  });
}); 


