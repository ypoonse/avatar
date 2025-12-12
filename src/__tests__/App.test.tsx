import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

async function selectAnimalAndGoToCustomize() {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /Arctic Fox/i }));
  await user.click(screen.getByRole("button", { name: /Customize/i }));

  return user;
}

test("shows animals and enables Customize when one is selected", async () => {
  const user = userEvent.setup();
  render(<App />);

  const customizeButton = screen.getByRole("button", { name: /Customize/i });
  expect(customizeButton).toBeDisabled();

  await user.click(screen.getByRole("button", { name: /Forest Bear/i }));

  expect(customizeButton).toBeEnabled();
});

test("updates price when customization options change", async () => {
  const user = await selectAnimalAndGoToCustomize();

  expect(await screen.findByText(/Configuring/)).toBeInTheDocument();
  expect(screen.getAllByText("$24.00")[0]).toBeInTheDocument();

  const eyesNextButton = screen.getAllByLabelText("Next option")[0];
  await user.click(eyesNextButton);

  expect(screen.getAllByText("$26.00")[0]).toBeInTheDocument();
});

test("review screen shows chosen options and total", async () => {
  const user = await selectAnimalAndGoToCustomize();

  const eyesNextButton = screen.getAllByLabelText("Next option")[0];
  await user.click(eyesNextButton);

  await user.click(screen.getByRole("button", { name: /Review/i }));

  expect(await screen.findByText(/Your avatar is ready/i)).toBeInTheDocument();
  expect(screen.getByText("Sleepy")).toBeInTheDocument();
  screen.debug();
  screen.logTestingPlaygroundURL();
  expect(screen.getAllByText("$26.00")[0]).toBeInTheDocument();
});

