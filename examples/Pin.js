// @flow

import * as React from "react";
import Unpin from "../src";

export default function Pin({
  initialValues,
  onEnd
}: {
  initialValues?: Array<string>,
  onEnd?: () => void
}) {
  return (
    <Unpin numberOfFields={4} initialValues={initialValues} onEnd={onEnd}>
      {({ fields }) => {
        return fields.map((field, i) => {
          return (
            <input
              key={i}
              data-testid={`digit-${i + 1}`}
              {...field.fieldProps}
            />
          );
        });
      }}
    </Unpin>
  );
}
