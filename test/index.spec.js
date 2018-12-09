// @flow

import "jest-dom/extend-expect";
import * as React from "react";
import { render, fireEvent, cleanup } from "react-testing-library";
import Pin from "../examples/Pin";

afterEach(cleanup);

const initialValues = ["1", "2", "3", "4"];

function backspace(inputEl) {
  return fireEvent.keyDown(inputEl, {
    key: "Backspace",
    keyCode: 8,
    which: 8
  });
}
function arrowRight(inputEl) {
  return fireEvent.keyDown(inputEl, {
    key: "ArrowRight",
    keyCode: 39,
    which: 39
  });
}
function arrowLeft(inputEl) {
  return fireEvent.keyDown(inputEl, {
    key: "ArrowLeft",
    keyCode: 37,
    which: 37
  });
}

test("sets auto focus on first element", () => {
  const { getByTestId } = render(<Pin />);
  expect(getByTestId("digit-1")).toHaveFocus();
});

test("renders with initialValues", () => {
  const { getByTestId } = render(<Pin initialValues={initialValues} />);
  expect(getByTestId("digit-1").value).toEqual("1");
  expect(getByTestId("digit-2").value).toEqual("2");
  expect(getByTestId("digit-3").value).toEqual("3");
  expect(getByTestId("digit-4").value).toEqual("4");
});

test("can update value", () => {
  const { getByTestId } = render(<Pin />);
  const digit1Input = getByTestId("digit-1");

  fireEvent.change(digit1Input, { target: { value: "1" } });

  expect(getByTestId("digit-1").value).toEqual("1");
  const digit2Input = getByTestId("digit-2");

  expect(digit2Input).toHaveFocus();
  fireEvent.change(digit2Input, { target: { value: "2" } });
  expect(getByTestId("digit-2").value).toEqual("2");
});

test("moves to the next input on change", () => {
  const { getByTestId } = render(<Pin />);
  const digit1Input = getByTestId("digit-1");
  fireEvent.change(digit1Input, { target: { value: "1" } });
  expect(getByTestId("digit-2")).toHaveFocus();
});

test("backspace clears value first, then moves back on next", () => {
  const { getByTestId } = render(<Pin />);
  const digit2Input = getByTestId("digit-2");

  digit2Input.click();
  fireEvent.change(digit2Input, { target: { value: "2" } });
  expect(digit2Input.value).toEqual("2");

  backspace(digit2Input);

  expect(digit2Input.value).toEqual("");
});

test("backspace on first input should stay there", () => {
  const { getByTestId } = render(<Pin initialValues={initialValues} />);
  const digit1Input = getByTestId("digit-1");

  backspace(digit1Input);

  expect(digit1Input).toHaveFocus();
  expect(digit1Input.value).toEqual("");
});

test("call onEnd when last input have been entered", () => {
  const onEndMock = jest.fn();
  const { getByTestId } = render(
    <Pin initialValues={["1", "2", "", ""]} onEnd={onEndMock} />
  );

  const digit3Input = getByTestId("digit-3");

  fireEvent.change(digit3Input, { target: { value: "1" } });

  expect(onEndMock).not.toHaveBeenCalled();

  const digit4Input = getByTestId("digit-4");

  fireEvent.change(digit4Input, { target: { value: "0" } });

  expect(onEndMock).toHaveBeenCalledWith("1210");
});

test("arrow keys move between inputs", () => {
  const { getByTestId } = render(<Pin />);
  const digit1Input = getByTestId("digit-1");

  arrowRight(digit1Input);

  const digit2Input = getByTestId("digit-2");

  expect(digit2Input).toHaveFocus();

  arrowLeft(digit2Input);

  expect(getByTestId("digit-1")).toHaveFocus();
});
