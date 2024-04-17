import FindUserByHandle from "../graphql/FindUserByHandle.graphql";
import FindUserByFID from "../graphql/FindUserByFID.graphql";
import { fetchQuery } from "@airstack/node";
import { print } from "graphql";

export interface AirStackUser {
  dappName: string;
  profileHandle: string;
  userId: string;
  connectedAddresses: {
    address: string;
  }[];
}

export function fetchPlayerByFID(fid?: string) {
  return fetchQuery(print(FindUserByFID), { fid: fid?.toString() });
}

export function fetchPlayerByHandle(handle?: string) {
  return fetchQuery(print(FindUserByHandle), { handle: handle });
}

export function fetchPlayers(
  myFID?: string,
  challengerHandle?: string
): Promise<(AirStackUser | undefined)[]> {
  return Promise.all([
    fetchPlayerByFID(myFID),
    fetchPlayerByHandle(challengerHandle),
  ]).then((results) => {
    console.log({ myFID, challengerHandle }, results);
    return results.map((result) => result.data.Socials.Social[0]);
  });
}

export function fetchPlayersByFID(
  player1?: string,
  player2?: string
): Promise<(AirStackUser | undefined)[]> {
  return Promise.all([
    fetchPlayerByFID(player1),
    fetchPlayerByFID(player2),
  ]).then((results) => {
    console.log("RESULTS", results);
    return results.map((result) => result.data.Socials.Social[0]);
  });
}
