import React from "react";
import { render, screen } from "@testing-library/react";
import FactoryGameMain from "./factory_game_main";

test("renders learn react link", () => {
  render(<FactoryGameMain />);
  const linkElement = screen.getByText(/region0/i);
  expect(linkElement).toBeInTheDocument();
});
