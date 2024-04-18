/** @jsxImportSource frog/jsx */

import { Box, Heading, Text, VStack, vars } from "@/app/ui";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import ConstantFlowAgreementV1ABI from "@/app/abis/ConstantFlowAgreementV1ABI";
import configuration, { Address } from "@/app/configuration";
import {
  AirStackUser,
  fetchPlayers,
  fetchPlayersByFID,
} from "@/app/utils/AirStackUtils";
import { buildShareUrl } from "@/app/utils/WarpcastUtils";
import { init } from "@airstack/node";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { FC } from "react";

const Intro = () => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      backgroundImage="url('http://localhost:3000/into.png')"
      backgroundSize="contain"
      padding="32"
      fontWeight="700"
      textAlign="center"
      paddingTop="60"
    >
      <VStack gap="12">
        <Text size={{ custom: "90px" }} color="red" align="center">
          YOINK OF WAR
        </Text>
        <Text size={{ custom: "60px" }} align="center">
          Challenge your friend lorem ipsum dolor sit amet
        </Text>
      </VStack>
    </Box>
  );
};

const Battle = () => {
  return (
    <Box
      grow
      alignHorizontal="center"
      backgroundColor="background"
      backgroundImage="url('http://localhost:3000/battle.png')"
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

interface StreamProps {
  flowRate: number;
  title: string;
}

const Stream: FC<StreamProps> = ({ flowRate, title }) => {
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
        <Text size={{ custom: "50px" }}>{title}</Text>

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

init(process.env.AIRSTACK_API_KEY!);

type State = {
  team?: string;
  flowRate: number;
  teams: [AirStackUser, AirStackUser] | [];
};

const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  imageAspectRatio: "1:1",
  imageOptions: { width: 955, height: 955 },
  ui: { vars },

  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  initialState: {
    flowRate: 1,
    team: undefined,
    teams: [],
  },
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", async (c) => {
  const { inputText, frameData, buttonValue, deriveState } = c;

  const challengerHandle = inputText;

  const state = await deriveState(async (previousState) => {
    switch (buttonValue) {
      case "reset":
        previousState.teams = [];
        previousState.flowRate = 1;
        break;
      case "inc":
        previousState.flowRate++;
        break;
      case "dec":
        previousState.flowRate = Math.max(1, previousState.flowRate - 1);
        break;
    }

    if (challengerHandle && previousState.teams.length !== 2) {
      const teamsData = await fetchPlayers(
        frameData?.fid?.toString(),
        challengerHandle
      );

      if (!teamsData.includes(undefined)) {
        previousState.teams = teamsData as [AirStackUser, AirStackUser];
      }
    }
  });

  console.log({ state });

  if (state.teams.length !== 2) {
    return c.res({
      image: <Intro />,
      intents: [
        <TextInput placeholder="Enter challenger handle..." />,
        <Button>Challenge!</Button>,
        <Button action="/info">Game Info!</Button>,
      ],
    });
  }

  const [myData, opponentData] = state.teams;

  if (!myData || !opponentData) {
    return c.res({
      image: (
        <Error
          title="Could not find the opponent."
          content="Please go back and try to enter a correct handle."
        />
      ),
      intents: [<Button.Reset>Back</Button.Reset>],
    });
  }

  return c.res({
    image: (
      <Stream
        flowRate={state.flowRate}
        title={`CHALLENGING @${opponentData.profileHandle}`.toUpperCase()}
      />
    ),
    intents: [
      <Button value="inc">+</Button>,
      <Button value="dec">-</Button>,
      <Button value="3">Start stream</Button>,
      <Button value="reset">Back</Button>,
      // <Button action={`/battle/${myData.userId}:${opponentData.userId}`}>
      //   Start first Yoink
      // </Button>,
      // TODO: This link will be urlencoded and "&" will turn to &amp;.
      // <Button.Link
      //   href={buildShareUrl(
      //     opponentData.profileHandle,
      //     `${myData.userId}:${opponentData.userId}`
      //   )}
      // >
      //   Cast battle!
      // </Button.Link>,
      // <Button.Reset>Back</Button.Reset>,
    ],
  });
});

app.frame("/info", (c) => {
  return c.res({
    image: (
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
          <Text size={{ custom: "50px" }}>GAME INFO</Text>
        </VStack>
      </Box>
    ),
    intents: [<Button.Reset>Back!</Button.Reset>],
  });
});

app.frame("/battle/:battleid", async (c) => {
  // TODO: Check if already in game OR just chose the team. If so, show game state.
  const { buttonValue, status, deriveState, frameData, env, req, verified } = c;

  console.log({ status, verified, env, frameData });

  const { battleid } = req.param();
  const [player1, player2] = battleid.split(":");

  console.log({ player1, player2 });

  // TODO: Fetch your current stream and team for this battle.
  const inGame = false;

  // TODO: Check if both people have started streams.
  const hasStarted = true;

  const state = await deriveState(async (previousState) => {
    switch (buttonValue) {
      case "team1":
        previousState.team = player1;
        break;
      case "team2":
        previousState.team = player2;
        break;
      case "reset":
        previousState.team = undefined;
        break;
      case "inc":
        previousState.flowRate++;
        break;
      case "dec":
        previousState.flowRate = Math.max(1, previousState.flowRate - 1);
        break;
    }

    if (previousState.teams.length !== 2) {
      const teamsData = await fetchPlayersByFID(player1, player2);
      if (!teamsData.includes(undefined)) {
        previousState.teams = teamsData as [AirStackUser, AirStackUser];
      }
    }
  });

  if (state.teams.length !== 2) {
    return c.res({
      image: (
        <Error title="Could not find the teams." content="Please try again." />
      ),
      intents: [<Button>Battle!</Button>],
    });
  }

  if (!hasStarted) {
    return c.res({
      image: (
        <Error
          title="Challenge not accepted yet."
          content="Anyone can join when both players have started a stream."
        />
      ),
    });
  }

  // TODO: If user that was challenged, automatically let them choose a flow rate.

  if (inGame || state.team) {
    const teamData = state.teams.find((team) => team.userId === state.team);

    if (!teamData) {
      return c.res({
        image: <Error title="Match not found." content="Please try again." />,
        intents: [<Button.Reset>Back</Button.Reset>],
      });
    }

    return c.res({
      image: <Stream title="HELP YOUR FREN" flowRate={state.flowRate} />,
      intents: [
        <Button value="inc">+</Button>,
        <Button value="dec">-</Button>,
        <Button value="3">Start stream</Button>,
        <Button value="reset">Back</Button>,
      ],
    });
  }

  return c.res({
    image: <Battle />,
    intents: state.teams.map((team, index) => (
      <Button value={`team${index + 1}`}>Join @{team.profileHandle}</Button>
    )),
  });
});

app.transaction("/start/:address/:flowRate", async (c) => {
  const { address, flowRate } = c.req.param();

  return c.contract({
    abi: ConstantFlowAgreementV1ABI,
    functionName: "createFlow",
    to: configuration.contracts.ConstantFlowAgreementV1,
    chainId: "eip155:8453",
    args: [
      configuration.contracts.Token,
      address as Address,
      BigInt(flowRate),
      "0x",
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
