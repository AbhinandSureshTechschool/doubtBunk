describe('Answers Page E2E', () => {
    beforeEach(() => {

        // Visit dynamic route
        cy.visit("http://localhost:3000/answers/123");

        // Mock logged user
        cy.window().then((win) => {
            win.localStorage.setItem(
                "doubtBunk",
                JSON.stringify({
                    id: "testUser123",
                    name: "Test User",
                    email: "test@gmail.com"
                })
            );
        });

        // Mock GET answers API
        cy.intercept("GET", "/api/answers/*", {
            statusCode: 200,
            body: {
                doubt: [{
                    _id: "123",
                    title: "Test Doubt Title",
                    description: "Test Doubt Description"
                }],
                answers: [
                    {
                        _id: "a1",
                        text: "This is an answer",
                        videoUrl: "",
                        user: "testUser123",
                        createdAt: "2026-01-01"
                    },
                    {
                        _id: "a2",
                        text: "Another answer",
                        videoUrl: "https://sample.mp4",
                        user: "otherUser",
                        createdAt: "2026-01-02"
                    }
                ]
            }
        }).as("getAnswers");

        cy.reload();
        cy.wait("@getAnswers");
    });

    it("Displays doubt title & description", () => {
        cy.contains("Test Doubt Title").should("be.visible");
        cy.contains("Test Doubt Description").should("be.visible")
    });

    it("Displays answer list", () => {
        cy.contains("This is an answer");
        cy.contains("Another answer")
    });

    it("Displays video when videoUrl exists", () => {
        cy.get('video').should("exist")
    });

    it("Shows delete button only for logged user answers", () => {
        cy.contains("This is an answer")
        .parent()
        .contains("Delete")
        .should("exist");

        cy.contains("Another answer")
        .parent()
        .contains("Delete")
        .should("not.exist");
    });

    it("Deletes an answer", () => {

        cy.intercept("DELETE", "/api/answers/*", {
            statusCode: 200,
            body: { message: "Answer deleted" }
        }).as("deleteAnswer");

        cy.contains("This is an answer")
        .parent()
        .contains("Delete")
        .click();

        cy.wait("@deleteAnswer");
    });
})