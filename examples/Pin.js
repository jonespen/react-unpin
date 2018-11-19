// @flow

import * as React from "react";
import Unpin from "../src";

export default function Pin() {
  return (
    <Unpin numberOfFields={4}>
      {({ fields }) => {
        return fields.map((field, i) => {
          return (
            <input key={i} data-testid={`digit-${i}`} {...field.fieldProps} />
          );
        });
      }}
    </Unpin>
  );
}
