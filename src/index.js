// @flow

import * as React from "react";

type Props = {
  initialValues?: Array<string>,
  numberOfFields: number,
  maxLength: number,
  type: "tel" | "text",
  labelRenderer: (index: number) => string,
  onEnd?: string => void,
  errorContainerId: string,
  children: ({
    values: Array<string>,
    fields: Array<{
      fieldProps: {
        value: string,
        onFocus: () => void,
        onChange: (event: SyntheticInputEvent<>) => void,
        maxLength: string
      }
    }>
  }) => React.Node
};

export default function Unpin({
  initialValues,
  numberOfFields,
  maxLength,
  type,
  labelRenderer,
  errorContainerId,
  children,
  onEnd
}: Props) {
  const refs = React.useMemo(
    () => Array.from({ length: numberOfFields }, () => React.createRef()),
    [numberOfFields]
  );

  const valuesArray =
    initialValues || Array.from({ length: numberOfFields }, () => "");
  const [values, setValues] = React.useState(valuesArray);

  function goToNextField(index) {
    const nextIndex = Math.min(index + 1, numberOfFields - 1);
    if (index < numberOfFields && refs[nextIndex].current) {
      refs[nextIndex].current.focus();
    }
  }

  return children({
    values,
    fields: values.map((value, index) => {
      return {
        fieldProps: {
          value,
          type,
          maxLength: `${maxLength}`,
          onKeyDown: event => {
            const prevRef = refs[index - 1];
            const nextRef = refs[index + 1];

            // backspace, go to previous
            if (event.which === 8) {
              const newValues = [...values];
              newValues[index] = "";
              setValues(newValues);

              if (index > 0 && prevRef && prevRef.current) {
                event.preventDefault();
                prevRef.current.focus();
              }
            }

            // arrow right, go to next
            if (event.which === 39) {
              event.preventDefault();
              if (nextRef && nextRef.current) {
                nextRef.current.focus();
              }
            }

            // arrow left, go to prev
            if (event.which === 37) {
              event.preventDefault();
              if (prevRef && prevRef.current) {
                prevRef.current.focus();
              }
            }
          },
          onKeyPress: event => {
            // if same value, go to next. onChange is not called
            if (event.key === value) {
              event.preventDefault();
              goToNextField(index);
            }
          },
          onChange: event => {
            const { value } = event.target;
            if (value === " ") {
              event.preventDefault;
              return;
            }
            goToNextField(index);
            const newValues = [...values];
            newValues[index] = value;
            setValues(newValues);

            if (onEnd && index + 1 === newValues.length) {
              onEnd(newValues.join(""));
            }
          },
          onFocus: () => {
            if (refs[index] && refs[index].current) {
              refs[index].current.select();
            }
          },
          ref: refs[index],
          autoFocus: index === 0,
          autoCorrect: "off",
          autoComplete: "off",
          autoCapitalize: "off",
          spellCheck: false,
          "aria-label": labelRenderer(index + 1),
          "aria-describedby": errorContainerId
        }
      };
    })
  });
}

Unpin.defaultProps = {
  numberOfFields: 4,
  maxLength: 1,
  type: "tel",
  labelRenderer: index => `Please enter the verification code digit ${index}`
};
