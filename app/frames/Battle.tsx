import { FC } from "react";
import { Box, Text, VStack } from "../ui";

interface BattleProps {}

const Battle: FC<BattleProps> = ({}) => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      backgroundImage="url('http://localhost:3000/battle2.png')"
      backgroundSize="contain"
      padding="32"
      fontWeight="700"
    >
      <VStack gap="4">
        <Text size={{ custom: "50px" }} align="center">
          CURRENTLY WINNING
        </Text>
        <Text size={{ custom: "90px" }} color="red" align="center">
          Your team
        </Text>

        <div
          style={{
            display: "flex",
            marginTop: "100px",
            justifyContent: "space-between",
            width: "660px",
            alignSelf: "center",
          }}
        >
          <Text size={{ custom: "50px" }} color="red">
            2 mates
          </Text>
          <Text size={{ custom: "50px" }} color="red">
            3 mates
          </Text>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "300px",
            justifyContent: "space-between",
            width: "800px",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          <div
            style={{
              border: "6px solid black",
              background: "white",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              minWidth: "320px",
            }}
          >
            <Text size={{ custom: "50px" }} align="center">
              123
            </Text>
            <Text size={{ custom: "50px" }} align="center">
              $YOINK
            </Text>
          </div>
          <div
            style={{
              border: "6px solid black",
              background: "white",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              minWidth: "320px",
            }}
          >
            <Text size={{ custom: "50px" }} align="center">
              123
            </Text>
            <Text size={{ custom: "50px" }} align="center">
              $YOINK
            </Text>
          </div>
        </div>
      </VStack>
    </Box>
  );
};

export default Battle;
