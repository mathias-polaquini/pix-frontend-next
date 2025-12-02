describe("Fluxo de Login", () => {
  it("deve permitir login e acessar o dashboard", () => {
    // 1 - Acessa tela de login
    cy.visit("http://localhost:3000/login");

    // 2 - Preenche email (ajuste se seu usuário for diferente)
    cy.get('input[type="email"]').clear().type("mathias@gmail.com");

    // 3 - Preenche senha (ajuste se sua senha for diferente)
    cy.get('input[type="password"]').clear().type("123456");

    // 4 - Clica no botão de login (procura botão com texto "Entrar")
    cy.contains("Entrar").click();

    // 5 - Verifica se houve redirecionamento para /dashboard
    cy.url().should("include", "/dashboard");

    // 6 - Verifica se aparece "Bem-vindo" na página
    cy.contains("Bem-vindo").should("exist");
  });
});
