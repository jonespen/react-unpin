import { configure } from "@storybook/react";

function loadStories() {
  require("../examples/stories.js");
  // You can require as many stories as you need.
}

// eslint-disable-next-line no-undef
configure(loadStories, module);
