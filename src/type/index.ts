export type SetRequest = {
  order: number;
  weight: number;
  rep: number;
  restSec: number;
};

export type WorkoutRequest = {
  name: string;
  type: string;
  setConfigs: SetRequest[];
};

export type RoutineRequest = {
  name: string;
  color: string;
  userId: number;
  workoutConfigs: WorkoutRequest[];
};
