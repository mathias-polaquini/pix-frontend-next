describe("Proteção de Rotas", () => {
  it("deve redirecionar usuário não autenticado para /login", () => {
    cy.visit("http://localhost:3000/dashboard", { failOnStatusCode: false });
    cy.url().should("include", "/login");
  });
});
