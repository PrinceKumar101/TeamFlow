import { useMemo } from "react";
import { useAppSelector } from "./redux";
import type { Project } from "@/types/dashboard";

export function useProjectMap() {
  const projects = useAppSelector((state) => state.projects.projects);
  return useMemo(() => {
    const map = new Map<string, Project>();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [projects]);
}
