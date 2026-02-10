import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
const initialState = {
  value: 0,
} satisfies { value: number };

export const asyncIncrementOfCount = createAsyncThunk(
  "counter/asyncIncrementOfCount",
  async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return amount;
  },
);

export const counterSlice = createSlice({
  name: "Counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByNumber: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncIncrementOfCount.pending, () =>
      console.log("Pending async count."),
    );
    builder.addCase(
      asyncIncrementOfCount.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.value += action.payload;
        console.log("Done count.");
      },
    );
  },
});

export const { increment, decrement, incrementByNumber } = counterSlice.actions;

export default counterSlice.reducer;
