import { createSystem } from "frog/ui";

export const {
  Box,
  Columns,
  Column,
  Heading,
  HStack,
  Rows,
  Row,
  Spacer,
  Text,
  VStack,
  vars,
} = createSystem({
  colors: {
    background: "#fff",
    text: "#000",
    red: "#FF0202",
  },
  fonts: {
    default: [
      {
        name: "Caveat",
        source: "google",
        weight: 700,
      },
    ],
  },
  frame: {
    width: 955,
    height: 955,
    aspectRatio: "1:1",
  },
});
