import { type Note } from "../src/schemas/noteSchemas";

function stringToBoolean(b: string) {
  return b === "false" ? false : true;
}

export function getNotesFromParams(url: string, notes: Note[]) {
  const queries = url.split("?")[1].split("&");
  const c: { isArchive?: string; search?: string; color?: string } =
    queries.reduce((acc, query) => {
      const x = query.split("=");
      return {
        ...acc,
        [x[0]]: x[1],
      };
    }, {});

  const result = notes.filter((x) => {
    const both = "search" in c && "color" in c;
    const onlyColor = "color" in c && !("search" in c);
    const onlySearch = "search" in c && !("color" in c);
    const onlyIsArchive =
      "isArchive" in c && !("color" in c) && !("search" in c);

    if (both) {
      return (
        x.isArchive == stringToBoolean(c.isArchive!) &&
        x.color == c.color &&
        (x.title.includes(c.search!) || x.content.includes(c.search!))
      );
    } else if (onlyIsArchive) {
      return x.isArchive == stringToBoolean(c.isArchive!);
    } else if (onlyColor) {
      return x.isArchive == stringToBoolean(c.isArchive!) && x.color == c.color;
    } else if (onlySearch) {
      return (
        x.isArchive == stringToBoolean(c.isArchive!) &&
        (x.title.includes(c.search!) || x.content.includes(c.search!))
      );
    }
  });

  return result;
}

export const notes: Note[] = [
  {
    id: 1,
    title: "title",
    content: "content",
    isArchive: false,
    authorId: 1,
    color: "white",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "hello",
    content: "bye",
    isArchive: false,
    authorId: 2,
    color: "red",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "cat",
    content: "dog",
    isArchive: true,
    authorId: 1,
    color: "white",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "pizza",
    content: "taco",
    isArchive: true,
    authorId: 2,
    color: "red",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
