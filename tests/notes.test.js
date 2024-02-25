import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/db.js", () => ({
  insertDB: jest.fn(),
  getDB: jest.fn(),
  saveDB: jest.fn(),
}));

const { insertDB, getDB, saveDB } = await import("../src/db.js");
const { newNote, getAllNotes, removeNote } = await import("../src/notes.js");

beforeEach(() => {
  insertDB.mockClear();
  getDB.mockClear();
  saveDB.mockClear();
});

describe("note cli app", () => {
  test("newNote should insert a new note and return it", async () => {
    const note = {
      content: "This is my first note",
      id: 1,
      tags: ["tag 1", "tag 2"],
    };

    insertDB.mockResolvedValue(note);

    const result = await newNote(note.content, note.tags);
    expect(result.content).toEqual(note.content);
    expect(result.tags).toEqual(note.tags);
  });

  test("should return all notes", async () => {
    const db = { notes: ["note 1", "note 2", "note 3"] };

    getDB.mockResolvedValue(db);

    const result = await getAllNotes();
    expect(result).toEqual(db.notes);
  });

  test("removeNote should do nothing if the id is not found", async () => {
    const notes = [
      { id: 1, content: "note 1" },
      { id: 2, content: "note 2" },
      { id: 3, content: "note 3" },
    ];

    saveDB.mockResolvedValue(notes);

    const id = 4;
    const result = await removeNote(id);
    expect(result).toBeUndefined();
  });
});
