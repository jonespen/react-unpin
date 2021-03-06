// @flow

import * as React from "react";
import { storiesOf } from "@storybook/react";
import Pin from "./Pin";

// eslint-disable-next-line no-undef
storiesOf("Pin", module)
  .add("default", () => <Pin />)
  .add("with initialValues", () => (
    <Pin initialValues={["1", "2", "3", "4"]} />
  ));
