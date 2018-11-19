// @flow

import * as React from "react";
import { useState } from "react";

type Props = {
  numberOfFields: number,
  maxLength: number,
  children: ({
    values: Array<string>,
    fields: Array<{
      fieldProps: {
        value: string,
        onFocus: () => void,
        onChange: (event: SyntheticInputEvent<>) => void,
        maxLength: "1"
      }
    }>
  }) => React.Node
};

export default function Unpin({ numberOfFields, maxLength, children }: Props) {
  // https://github.com/facebook/react/issues/14072#issuecomment-436843834
  const refs = React.useMemo(
    () => Array.from({ length: numberOfFields }, () => React.createRef()),
    [numberOfFields]
  );

  const valuesArray = Array.from({ length: numberOfFields }, () => "");
  const [values, setValues] = useState(valuesArray);

  function goToNextField(index) {
    const nextIndex = Math.min(index + 1, numberOfFields - 1);
    if (index < numberOfFields) {
      refs[nextIndex].current.focus();
    }
  }

  return children({
    values,
    fields: values.map((value, index) => {
      return {
        fieldProps: {
          value,
          maxLength: `${maxLength}`,
          onKeyDown: event => {
            // backspace, go to previous
            if (event.which === 8 && index > 0 && refs[index - 1]) {
              event.preventDefault();
              refs[index - 1].current.focus();
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
          },
          onFocus: () => {
            if (refs[index] && refs[index].current) {
              refs[index].current.select();
            }
          },
          ref: refs[index],
          autoFocus: index === 0
        }
      };
    })
  });
}

Unpin.defaultProps = {
  numberOfFields: 4,
  maxLength: 1
};
