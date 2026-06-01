const expenseModel = require("../src/model/expence.model");
const {
  addExpense,
  getExpenses,
} = require("../src/controllers/expense.contoller");

jest.mock("../src/model/expence.model", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
}));

function createRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("Expense API tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("addExpense should return 400 when title/amount missing", async () => {
    const req = {
      body: {},
      user: { _id: "user-1" },
    };
    const res = createRes();

    await addExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title and amount are required",
    });
  });

  test("addExpense should create expense and return 201", async () => {
    const createdExpense = {
      _id: "exp-1",
      title: "Lunch",
      amount: 200,
      paidBy: "user-1",
    };

    expenseModel.create.mockResolvedValue(createdExpense);

    const req = {
      body: { title: "Lunch", amount: 200 },
      user: { _id: "user-1" },
    };
    const res = createRes();

    await addExpense(req, res);

    expect(expenseModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Lunch",
        amount: 200,
        paidBy: "user-1",
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Expense added successfully",
      expense: createdExpense,
    });
  });

  test("addExpense should return 400 when amount is negative", async () => {
    const req = {
      body: { title: "Refund-like bad input", amount: -200 },
      user: { _id: "user-1" },
    };
    const res = createRes();

    await addExpense(req, res);

    expect(expenseModel.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Amount must be greater than 0",
    });
  });

  test("getExpenses should return user expenses", async () => {
    const expenseList = [{ _id: "exp-1", title: "Dinner", amount: 500 }];
    const sortMock = jest.fn().mockResolvedValue(expenseList);
    expenseModel.find.mockReturnValue({ sort: sortMock });

    const req = { user: { _id: "user-1" } };
    const res = createRes();

    await getExpenses(req, res);

    expect(expenseModel.find).toHaveBeenCalledWith({ paidBy: "user-1" });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Expenses retrieved successfully",
      expenses: expenseList,
    });
  });

  test("updateExpense should return 400 when no fields provided", async () => {
    const { updateExpense } = require("../src/controllers/expense.contoller");

    const req = {
      params: { id: "exp-1" },
      body: {},
      user: { _id: "user-1" },
    };
    const res = createRes();

    await updateExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "At least one field (title, amount, date) is required to update",
    });
  });
});
