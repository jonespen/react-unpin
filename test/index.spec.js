// @flow

import "jest-dom/extend-expect";
import * as React from "react";
import { render, fireEvent, cleanup } from "react-testing-library";
import Pin from "../examples/Pin";

afterEach(cleanup);

test("returns value in render function", () => {
  const { getByTestId } = render(<Pin />);

  const digit1Input = getByTestId("digit-1");

  expect(digit1Input).toHaveFocus();

  fireEvent.change(digit1Input, { target: { value: "1" } });

  expect(getByTestId("digit-1").value).toEqual("1");
  const digit2Input = getByTestId("digit-2");

  expect(digit2Input).toHaveFocus();

  fireEvent.change(digit2Input, { target: { value: "2" } });
  expect(getByTestId("digit-2").value).toEqual("2");
  expect(getByTestId("digit-2")).toHaveFocus();
});
