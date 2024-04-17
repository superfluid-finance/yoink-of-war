import { FC, PropsWithChildren } from "react";
import { Box, VStack, Heading, Text } from "../ui";

interface ErrorProps {
  title: string;
  content: string;
}

const Error: FC<ErrorProps> = ({ title, content }) => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      padding="32"
    >
      <VStack gap="4">
        <Heading>{title}</Heading>
        <Text size={{ custom: "50px" }}>{content}</Text>
      </VStack>
    </Box>
  );
};

export default Error;
