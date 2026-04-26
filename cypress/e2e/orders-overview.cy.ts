// cypress/e2e/orders-overview.cy.ts
// E2E testovi za Orders Overview komponentu

describe('Orders Overview Component', () => {
  const setSupervisorUser = () => {
    window.localStorage.setItem('authToken', 'fake-jwt-token');
    window.localStorage.setItem(
      'loggedUser',
      JSON.stringify({
        email: 'supervisor@test.com',
        role: 'Supervisor',
        permissions: [],
      }),
    );
  };

  it('ne treba da dozvoli pristup bez ulogovanog korisnika', () => {
    window.localStorage.clear();

    cy.visit('/orders-overview');

    cy.url().should('include', '/login');
  });

  it('ne treba da dozvoli pristup korisniku bez supervisor permisije', () => {
    window.localStorage.setItem('authToken', 'fake-jwt-token');
    window.localStorage.setItem(
      'loggedUser',
      JSON.stringify({
        email: 'agent@test.com',
        role: 'Agent',
        permissions: [],
      }),
    );

    cy.visit('/orders-overview');

    cy.url().should('include', '/403');
  });

  describe('kada je korisnik Supervisor', () => {
    beforeEach(() => {
      setSupervisorUser();
      cy.visit('/orders-overview');
    });

    it('treba da prikaže Orders Overview stranicu', () => {
      cy.contains('Orders Overview').should('be.visible');
      cy.contains('Review, approve, decline and cancel trading orders.').should(
        'be.visible',
      );
    });

    it('treba da prikaže filtere za statuse ordera', () => {
      cy.contains('button', 'ALL').should('be.visible');
      cy.contains('button', 'PENDING').should('be.visible');
      cy.contains('button', 'APPROVED').should('be.visible');
      cy.contains('button', 'DECLINED').should('be.visible');
      cy.contains('button', 'DONE').should('be.visible');
    });

    it('treba da označi izabrani filter kao aktivan', () => {
      cy.contains('button', 'PENDING').click();

      cy.contains('button', 'PENDING').should('have.class', 'active');
    });

    it('treba da prikaže kolone tabele', () => {
      cy.contains('th', 'Agent').should('be.visible');
      cy.contains('th', 'Order type').should('be.visible');
      cy.contains('th', 'Asset type').should('be.visible');
      cy.contains('th', 'Quantity').should('be.visible');
      cy.contains('th', 'Contract size').should('be.visible');
      cy.contains('th', 'Price per unit').should('be.visible');
      cy.contains('th', 'Direction').should('be.visible');
      cy.contains('th', 'Remaining portions').should('be.visible');
      cy.contains('th', 'Status').should('be.visible');
      cy.contains('th', 'Actions').should('exist');
    });

    it('treba da prikaže empty state kada nema ordera', () => {
      cy.contains('No orders found for selected filter.').should('be.visible');
    });

    it('ne treba da prikaže akcione dugmiće kada nema ordera', () => {
      cy.contains('button', 'Approve').should('not.exist');
      cy.contains('button', 'Decline').should('not.exist');
      cy.contains('button', 'Otkaži').should('not.exist');
    });

    it('treba da ostane na stranici nakon promene filtera bez ordera', () => {
      cy.contains('button', 'DONE').click();

      cy.contains('Orders Overview').should('be.visible');
      cy.contains('button', 'DONE').should('have.class', 'active');
      cy.contains('No orders found for selected filter.').should('be.visible');
    });
  });
});
