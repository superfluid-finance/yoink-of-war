import { FC } from "react";
import { Box, VStack, Heading, Text } from "../ui";

interface ChallengeProps {
  handle1: string;
  handle2: string;
}

const Challenge: FC<ChallengeProps> = ({ handle1, handle2 }) => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundImage="url('http://localhost:3000/battle.png')"
      backgroundSize="contain"
      padding="32"
      fontWeight="700"
    >
      <VStack gap="4">
        <Heading>
          @{handle1} is going to challenge @{handle2}.
        </Heading>
        <Text size={{ custom: "50px" }}>
          Once you've both started a stream, the game starts.
        </Text>
      </VStack>
    </Box>
  );
};

export default Challenge;
