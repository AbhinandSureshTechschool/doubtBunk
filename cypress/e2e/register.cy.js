describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000');
    })
});

describe("DoubtBunk register", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/register")
    });

    it("show register form", () => {
        cy.visit("http://localhost:3000/register");
        cy.contains("Create an Account");
        cy.contains("Name");
        cy.contains("Email");
        cy.contains("Password");
    });

    it("allows users to type name email & password", () => {
        cy.get("#name").type("test");
        cy.get("#email").type("test@gmail.com");
        cy.get("#password").type("123456");

        cy.get("#name").should("have.value", "test");
        cy.get("#email").should("have.value", "test@gmail.com");
        cy.get("#password").should("have.value", "123456");
    });

    it("submit register form", () => {
        cy.get("#name").type("test");
        cy.get("#email").type("test@gmail.com");
        cy.get("#password").type("123456");

        cy.contains("Register").click();
    })
})