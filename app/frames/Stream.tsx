import { FC } from "react";
import { Box, Text, VStack } from "../ui";

interface StreamProps {
  flowRate: number;
}

const Stream: FC<StreamProps> = ({ flowRate }) => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      backgroundImage="url('http://localhost:3000/yoink.png')"
      backgroundSize="cover"
      padding="48"
      fontWeight="700"
      textAlign="center"
    >
      <VStack gap="16" alignHorizontal="center">
        <Text size={{ custom: "50px" }}>HELP YOUR FREN</Text>

        <div style={{ display: "flex", width: "624px" }}>
          <Text size={{ custom: "60px" }} color="red">
            Stream as many $YOINK as possible to win the war
          </Text>
        </div>
        <div
          style={{
            border: "8px solid black",
            background: "white",
            borderRadius: "16px",
            paddingBottom: "34px",
            textAlign: "center",
            width: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "100px",
          }}
        >
          <Text size={{ custom: "200px" }}>{flowRate}</Text>
          <Text size={{ custom: "40px" }} color="red">
            YOINK / hour
          </Text>
        </div>
      </VStack>
    </Box>
  );
};

export default Stream;
