import type { IPostgresInterval } from "postgres-interval";

export interface IntervalObject
  extends Pick<
    IPostgresInterval,
    | "days"
    | "hours"
    | "milliseconds"
    | "minutes"
    | "months"
    | "seconds"
    | "years"
  > {}
