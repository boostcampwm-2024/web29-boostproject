import { API_V1_URL } from "./constants";
import http from "./http";

type CreateNoteRequestBody = {
  userId: string;
  noteName: string;
};

type CreateNoteResponseBody = {
  urlPath: string;
};

export async function createNote(body: CreateNoteRequestBody) {
  const response = await http.post<CreateNoteResponseBody>(
    `${API_V1_URL}/note`,
    { body: JSON.stringify(body) },
  );
  return response.data;
}
