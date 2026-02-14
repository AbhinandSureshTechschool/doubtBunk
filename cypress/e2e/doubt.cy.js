describe("DoubtBunk - Doubts Page", () => {

  Cypress.on("uncaught:exception", () => false);

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        "doubtBunk",
        JSON.stringify({
          id: "test-user-id",
          email: "test@gmail.com"
        })
      );
    });

    cy.intercept("GET", "/api/doubts", {
      statusCode: 200,
      body: {
        doubts: [
          {
            _id: "1",
            title: "React doubt",
            description: "How useState works?"
          },
          {
            _id: "2",
            title: "Node doubt",
            description: "What is middleware?"
          }
        ]
      }
    }).as("getDoubts");

    cy.intercept("GET", '/api/answers/count/*', {
      statusCode: 200,
      body: { count: 2 }
    }).as("getAnswersCount");

    cy.visit("http://localhost:3000/doubts");

    cy.wait("@getDoubts");

  });


  it("Loads doubt page successfully", () => {

    cy.get('[data-testid="search-input"]')
      .should("be.visible");

  });


  it("Search filters doubts", () => {

    cy.get('[data-testid="search-input"]')
      .type("React");

    cy.contains("React doubt").should("be.visible");
    cy.contains("Node doubt").should("not.exist");

  });

  it("Opens Add Solution modal", () => {

    cy.contains("Add Solution").click();

    cy.get("textarea[name='text']")
      .should('exist')
      .and('be.visible')
  });

  it("Submits a solution", () => {

    cy.intercept("POST", "/api/answers", {
      statusCode: 200,
      body: { message: "Answer added successful" }
    }).as("addSolution");

    cy.contains("Add Solution").click();

    cy.get("textarea[name='text']")
      .type("This is a Cypress solution");
    
    cy.contains("Submit").click();

    cy.wait("@addSolution");

    cy.contains("Answer added successful");
  })

});
