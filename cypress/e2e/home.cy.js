describe("DoubtBunk - Home Page E2E", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");

        cy.window().then((win) => {
            win.localStorage.setItem(
                "doubtBunk",
                JSON.stringify({
                    id: 'testUser123',
                    name: 'Test User',
                    email: "test@gmail.com"
                })
            );
        });

        cy.intercept("GET", "/api/doubts/*", {
            statusCode: 200,
            body: {
                doubts: [
                    {
                        _id: "1",
                        title: "Sample Doubt",
                        description: "Sample Description"
                    }
                ]
            }
        }).as("getDoubts");

        cy.intercept("GET", '/api/answers/count/*', {
            statusCode: 200,
            body: { count: 2 }
        }).as("getAnswersCount");

        cy.reload();
        cy.wait("@getDoubts");
    });

    it("loads home page successfully", () => {
        cy.contains("Clear Your Doubts.");
        cy.contains("Share Knowledge.");
    });

    it("Display Navbar", () => {
        cy.get("nav").should("exist");
    });

    it("Open Add Doubt Modal", () => {
        cy.contains("Add Doubt").click();

        cy.get("input[name='title']").should("be.visible");
        cy.get("textarea[name='description']").should("be.visible");
    });

    it("Submits a new doubt", () => {

        cy.intercept("POST", "/api/doubts", {
            statusCode: 200,
            body: { message: "Doubt added successfully" }
        }).as("addDoubt");

        cy.contains("Add Doubt").click();

        cy.get("input[name='title']").type("cypress Test Doubt");
        cy.get("textarea[name='description']").type("This is a test doubt");
        
        cy.contains("Submit").click();

        cy.wait("@addDoubt");
        cy.contains("Doubt added successfully");
    });

    it("Fetches and displays doubts", () => {

        cy.intercept("GET", "/api/doubts/*", {
            statusCode: 200,
            body: {
                doubts: [
                    { 
                        _id: "1",
                        title: "Test Doubt 1",
                        description: "Test Description 1"
                    }
                ]
            }
        }).as("getDoubts");

        cy.reload();
        cy.wait("@getDoubts");

        cy.contains("Test Doubt 1");
        cy.contains("Test Description 1");
    });

    it("Opens Edit Doubt Modal", () => {
        cy.intercept("GET", "/api/doubts/*", {
            statusCode: 200,
            body: {
                doubts: [
                    {
                        _id: "1",
                        title: "New edit Doubt",
                        description: "New edit Desc"
                    }
                ]
            }
        });

        cy.reload();
        cy.contains("Edit").click();

        cy.wait('@getAnswersCount')
        
        cy.get("[data-cy='edit-title-input']").should("exist").and("be.visible");
    });

    it("Edits a doubt", () => {
        cy.intercept("PUT", "/api/doubts/*", {
            statusCode: 200,
            body: { message: "Doubt updated" }
        }).as("editDoubt");

        cy.reload();
        cy.contains("Edit").click();

        cy.get("input[name='title']").clear().type("updated doubt");

        cy.contains("Edit Doubt").click();

        cy.wait("@editDoubt");
        cy.contains("Doubt updated");
    });


    it("Delete a doubt", () => {

    cy.intercept("DELETE", "/api/doubts/*", {
        statusCode: 200,
        body: { message: "Doubt deleted" }
    }).as("deleteDoubt");

    cy.contains("Delete").click();
    cy.wait("@deleteDoubt");
    cy.contains("Doubt deleted");
  });
})


