describe("CRUD de Chaves PIX", () => {
  it("deve permitir criar uma chave PIX", () => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[type="email"]').type("mathias@gmail.com");
    cy.get('input[type="password"]').type("123456");
    cy.contains("Entrar").click();
    cy.url().should("include", "/dashboard");

    // 2 - Acessar tela de chave
    cy.visit("http://localhost:3000/dashboard/chaves");

    // 3 - Preencher chave
    const chave = `teste${Date.now()}@email.com`; // chave única
    cy.get('input[placeholder="Digite a chave"]').type(chave);

    // 4 - Selecionar tipo
    cy.get("select").select("E");

    // 5 - Clicar no botão Criar
    cy.contains("Criar").click();

    // 6 - Validar que a chave aparece na lista
    cy.contains(chave).should("exist");
  });
});
