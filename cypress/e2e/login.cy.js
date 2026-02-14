describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
  })
});


describe("DoubtBunk login", () => {
  Cypress.on("uncaught:exception", () => false);

  beforeEach(() => {
    cy.visit("http://localhost:3000/login")
  });

  it("Show login form", () => {
    cy.visit("http://localhost:3000/login");
    cy.contains("Welcome Back");
    cy.contains("Email");
    cy.contains("Password");
  });

  it("Allows users to type email & password", () => {
    cy.get("#email").type("test@gmail.com");
    cy.get("#password").type("123456");

    cy.get("#email").should("have.value", "test@gmail.com");
    cy.get("#password").should("have.value", "123456");
  });

  it("Submits login form", () => {
    cy.get("#email").type("abinandsuresh39@gmail.com");
    cy.get("#password").type("Abhi@123");

    cy.contains("Sign In").click();
  })

});

