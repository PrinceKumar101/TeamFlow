import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

type todoType = {
  id: number;
  task: string;
  completed: boolean;
};


const initialState: Array<todoType> = [];

const addTodoData = createAsyncThunk(
  "todo/addTodoData",
  async (payload: Omit<todoType, "id">) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const id = Date.now();
    return {
      id,
      task: payload.task,
      completed: payload.completed,
    };
  },
);
const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<todoType>) => {
      state.push({
        id: action.payload.id,
        task: action.payload.task,
        completed: action.payload.completed,
      });
    },
    removeTodo: (state, action: PayloadAction<{ id: number }>) => {
      state = state.filter((item) =>
        item.id === action.payload.id ? {} : item,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodoData.pending, () => console.log("Pending state."));
    builder.addCase(addTodoData.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(addTodoData.rejected, () => {
      console.log("State change rejected.");
    });
  },
});
export const {addTodo, removeTodo} = todoSlice.actions
export default todoSlice.reducer
