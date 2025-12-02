describe("Envio de PIX", () => {
  it("deve permitir enviar um PIX com sucesso", () => {
    // 1 - Login
    cy.visit("http://localhost:3000/login");
    cy.get('input[type="email"]').type("mathias@gmail.com");
    cy.get('input[type="password"]').type("123456");
    cy.contains("Entrar").click();
    cy.url().should("include", "/dashboard");

    // 2 - Ir até enviar PIX
    cy.visit("http://localhost:3000/dashboard/transacoes/enviar");

    // 3 - Selecionar chave de origem
    cy.get("select").first().select(1); // seleciona a segunda opção (índice 1)

    // 4 - Preencher chave destino
    const destino = `destino${Date.now()}@email.com`;
    cy.get('input[placeholder="Digite a chave destino"]').type(destino);

    // 5 - Preencher valor
    cy.get('input[placeholder="0.00"]').type("10");

    // 6 - Preencher mensagem
    cy.get('input[placeholder="Mensagem"]').type("Teste Cypress");

    // 7 - Enviar PIX
    cy.contains("Enviar PIX").click();

    // 8 - Validar resposta
    cy.contains("PIX enviado").should("exist");
  });
});
