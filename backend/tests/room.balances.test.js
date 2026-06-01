const roomModel = require("../src/model/room.model");
const roomExpenseModel = require("../src/model/roomExpense.model");
const { getBalances } = require("../src/controllers/room.controller");

jest.mock("../src/model/room.model", () => ({
  findOne: jest.fn(),
}));

jest.mock("../src/model/roomExpense.model", () => ({
  find: jest.fn(),
}));

function createRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("Room balances tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getBalances should return 404 when room does not exist", async () => {
    roomModel.findOne.mockResolvedValue(null);

    const req = { params: { code: "ROOM-1" } };
    const res = createRes();

    await getBalances(req, res);

    expect(roomModel.findOne).toHaveBeenCalledWith({ code: "ROOM-1" });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "circle not found" });
  });

  test("getBalances should calculate balances and settlement suggestions", async () => {
    roomModel.findOne.mockResolvedValue({
      code: "ROOM-1",
      name: "Trip",
      deleted: false,
      members: [
        { id: "A", name: "Aman" },
        { id: "B", name: "Bina" },
        { id: "C", name: "Chirag" },
      ],
    });

    roomExpenseModel.find.mockResolvedValue([
      {
        _id: "exp-1",
        title: "Hotel",
        amount: 90,
        paidBy: "A",
        participants: ["A", "B", "C"],
        date: new Date("2026-01-01"),
      },
    ]);

    const req = { params: { code: "ROOM-1" } };
    const res = createRes();

    await getBalances(req, res);

    expect(roomExpenseModel.find).toHaveBeenCalledWith({
      roomCode: "ROOM-1",
      deleted: { $ne: true },
    });

    expect(res.status).toHaveBeenCalledWith(200);

    const payload = res.json.mock.calls[0][0];
    expect(payload.totalSpentAll).toBe(90);
    expect(payload.expensesCount).toBe(1);
    expect(payload.balances).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "A", net: 60 }),
        expect.objectContaining({ id: "B", net: -30 }),
        expect.objectContaining({ id: "C", net: -30 }),
      ])
    );
    expect(payload.settlementsSuggested).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ toId: "A", amount: 30 }),
      ])
    );
  });

  test("addExpense should return 400 when paidBy is not a member", async () => {
    roomModel.findOne.mockResolvedValue({
      code: "ROOM-1",
      deleted: false,
      members: [
        { id: "A", name: "Aman" },
        { id: "B", name: "Bina" },
      ],
    });

    const req = {
      params: { code: "ROOM-1" },
      body: {
        title: "Dinner",
        amount: 500,
        paidBy: "X",
        participants: ["A", "B"],
      },
      user: { _id: "user-1" },
    };
    const res = createRes();

    const { addExpense } = require("../src/controllers/room.controller");
    await addExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "paidBy must be a circle member",
    });
  });

  test("addExpense should return 400 when participants include non-member", async () => {
    roomModel.findOne.mockResolvedValue({
      code: "ROOM-1",
      deleted: false,
      members: [
        { id: "A", name: "Aman" },
        { id: "B", name: "Bina" },
      ],
    });

    const req = {
      params: { code: "ROOM-1" },
      body: {
        title: "Dinner",
        amount: 500,
        paidBy: "A",
        participants: ["X", "Y"],
      },
      user: { _id: "user-1" },
    };
    const res = createRes();

    const { addExpense } = require("../src/controllers/room.controller");
    await addExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "all participants must be circle members",
    });
  });
});
