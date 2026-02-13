import { useAppDispatch } from "@/hooks/redux";
import { Button } from "./ui/button";
import { toggleTheme } from "@/store/slices/themeSlice";

const ThemSwitcherButton = () => {
    const dispatch = useAppDispatch();
  return (
    <>
      <Button
        onClick={() => {
          dispatch(toggleTheme());
        }}
      >
        tog
      </Button>
    </>
  );
};
export default ThemSwitcherButton
