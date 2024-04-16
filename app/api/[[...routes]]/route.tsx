/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

type State = {
  team?: number;
  flowRate: number;
};

const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  imageAspectRatio: "1:1",
  imageOptions: { width: 955, height: 955 },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  initialState: {
    team: undefined,
    flowRate: 1,
  },
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  const { inputText, status, verified, frameData } = c;
  console.log({ verified, frameData, fid: frameData?.fid });

  const challengedFID = inputText;

  console.log({ BATTLEID: `/battle/${challengedFID}` });

  if (challengedFID) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: "center",
            background: "white",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
              display: "flex",
            }}
          >
            You are going to challenge {challengedFID}.<br />
            <br />
            Once you've both started a stream, the game starts.
          </div>
        </div>
      ),
      intents: [
        <Button action={`/battle/${challengedFID}`}>Start first Yoink</Button>,
        <Button.Reset>Back</Button.Reset>,
      ],
    });
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "white",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <img src="/intro.png" width="100%" />
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter challenger FID..." />,
      <Button>Challenge!</Button>,
    ],
  });
});

app.frame("/battle/:battleid", (c) => {
  // TODO: Check if already in game OR just chose the team. If so, show game state.
  const { buttonValue, status, deriveState } = c;

  // TODO: Fetch your current stream and team for this battle.
  const inGame = false;

  // TODO: Check if both people have started streams.
  const hasStarted = true;

  const state = deriveState((previousState) => {
    switch (buttonValue) {
      case "team1":
        previousState.team = 1;
        break;
      case "team2":
        previousState.team = 2;
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
  });

  if (!hasStarted) {
    return c.res({
      image: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            fontSize: 40,
          }}
        >
          <div style={{ display: "flex" }}>
            The challenge is not accepted yet.
          </div>
          <div style={{ display: "flex" }}>
            Anyone can join when both players have started a stream.
          </div>
        </div>
      ),
    });
  }

  // TODO: If user that was challenged, automatically let them choose a flow rate.
  if (!inGame && state.team === undefined) {
    return c.res({
      image: (
        <div style={{ color: "white", fontSize: 60 }}>Choose your team!</div>
      ),
      intents: [
        <Button value="team1">Team 1</Button>,
        <Button value="team2">Team 2</Button>,
      ],
    });
  }

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          color: "white",
          fontSize: 60,
        }}
      >
        <div style={{ display: "flex" }}>
          {inGame
            ? `Update the stream for team ${state.team}`
            : `Start the stream for team ${state.team}`}
        </div>
        <div style={{ display: "flex" }}>
          Flow rate per week: {state.flowRate}
        </div>
      </div>
    ),
    intents: [
      <Button value="inc">+</Button>,
      <Button value="dec">-</Button>,
      <Button value="3">Start stream</Button>,
      <Button value="reset">Back</Button>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
