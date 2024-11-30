import { API_V3_URL } from "./constants";
import http from "./http";

type CreateSpaceRequestBody = {
  userId: string;
  spaceName: string;
  parentContextNodeId: string | null;
};

type CreateSpaceResponseBody = {
  urlPath: [string];
};

export async function createSpace(body: CreateSpaceRequestBody) {
  const response = await http.post<CreateSpaceResponseBody>(
    `${API_V3_URL}/space`,
    { body: JSON.stringify(body) },
  );
  return response.data;
}

// export async function getSpace(spaceId: string) {
//   // FIXME
//   throw new Error("Not implemented");
// }

// export async function createSubspace() {
//   // FIXME
//   throw new Error("Not implemented");
// }
