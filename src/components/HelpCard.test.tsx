import React from "react";
import { render, screen } from "@testing-library/react";
import { HelpCard } from "./HelpCard";

// This is a better test than it seems. It renders most elements.
test("Renders the Help Card", () => {
  const onConfirm = jest.fn();
  render(<HelpCard onConfirm={onConfirm} />);
  const factoryTitleText = screen.getByText(/Producing iron gear wheel/i);
  expect(factoryTitleText).toBeInTheDocument();
});
