/** @jsxImportSource frog/jsx */

import { vars } from "@/app/ui";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import ConstantFlowAgreementV1ABI from "@/app/abis/ConstantFlowAgreementV1ABI";
import configuration, { Address } from "@/app/configuration";
import Battle from "@/app/frames/Battle";
import Challenge from "@/app/frames/Challenge";
import Error from "@/app/frames/Error";
import Intro from "@/app/frames/Intro";
import Stream from "@/app/frames/Stream";
import {
  AirStackUser,
  fetchPlayers,
  fetchPlayersByFID,
} from "@/app/utils/AirStackUtils";
import { buildShareUrl } from "@/app/utils/WarpcastUtils";
import { init } from "@airstack/node";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

init(process.env.AIRSTACK_API_KEY!);

type State = {
  team?: string;
  flowRate: number;
  teams: [AirStackUser, AirStackUser];
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
  const { inputText, frameData } = c;

  const challengerHandle = inputText;

  if (!challengerHandle) {
    return c.res({
      image: <Intro />,
      intents: [
        <TextInput placeholder="Enter challenger handle..." />,
        <Button>Challenge!</Button>,
      ],
    });
  }

  const [myData, opponentData] = await fetchPlayers(
    frameData?.fid?.toString(),
    challengerHandle
  );

  if (!myData?.userId || !opponentData?.userId) {
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
      <Challenge
        handle1={myData.profileHandle || ""}
        handle2={opponentData.profileHandle || ""}
      />
    ),
    intents: [
      <Button action={`/battle/${myData.userId}:${opponentData.userId}`}>
        Start first Yoink
      </Button>,
      // TODO: This link will be urlencoded and "&" will turn to &amp;.
      <Button.Link
        href={buildShareUrl(
          opponentData.profileHandle,
          `${myData.userId}:${opponentData.userId}`
        )}
      >
        Cast battle!
      </Button.Link>,
      <Button.Reset>Back</Button.Reset>,
    ],
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
      image: <Stream flowRate={state.flowRate} />,
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
