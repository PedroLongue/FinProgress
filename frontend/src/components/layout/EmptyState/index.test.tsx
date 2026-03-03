import { render, screen } from "@testing-library/react";
import { EmptyState } from ".";

describe("EmptyState Component", () => {
  it.each([
    {
      type: "spending" as const,
      title: "Nenhum gasto registrado",
      description:
        "Cadastre e pague seus boletos para visualizar o histórico de gastos mensais e comparativos.",
    },
    {
      type: "billList" as const,
      title: "Nenhum boleto cadastrado",
      description:
        "Comece adicionando seus boletos para acompanhar vencimentos enunca mais perca prazos.",
    },
    {
      type: "category" as const,
      title: "Nenhuma categoria com gastos",
      description:
        "Não há gastos registrados nas categorias selecionadas. Tente alterar o período ou cadastre boletos.",
    },
  ])(
    "should render the %s variant with correct copy",
    ({ type, title, description }) => {
      render(<EmptyState type={type} />);

      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    },
  );

  it("should render billList with filters (correct copy)", () => {
    render(<EmptyState type="billList" emptyBillListFilter={["PENDING"]} />);

    expect(
      screen.getByRole("heading", {
        name: "Nenhum boleto cadastrado no filtro",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Não encontramos boletos com os filtros aplicados. Tente alterar a categoria ou status.",
      ),
    ).toBeInTheDocument();
  });
});
