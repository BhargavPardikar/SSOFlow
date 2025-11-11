describe('Intercept Continue button redirect', () => {
  it('should intercept the GET call and verify redirect', () => {
    cy.visit('https://bhargavpardikar.miniorange.in/moas/broker/login/jwt/25774?client_id=oTpfpFmJgikCsXyikSdfmYz2SvsPvllZ&redirect_uri=https://jwt.io/');
  });
}); 


