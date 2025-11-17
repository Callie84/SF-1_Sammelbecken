import { Page } from "playwright";
import { AdapterResult } from "../types";

export interface Adapter {
  seedbank: string;
  startUrl: string;
  run(page: Page): Promise<AdapterResult>;
}