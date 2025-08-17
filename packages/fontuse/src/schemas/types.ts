import { FontData } from './font';
import { FontUsecase } from './prompt';

export type Usecase = FontUsecase['useCases'][number];

export type UseCaseMetadata = Usecase & {
  id: string;
  fontName: string;
  popularity: number | null;
  designScore: number | null;
  readabilityScore: number | null;
};

export type UseCaseWithFont = UseCaseMetadata & {
  font?: Font | null;
};

export type Font = FontData & {
  id: string;
  properties:
    | FontUsecase['properties']
    | {
        allCaps: boolean | null;
      };
  popularity: number | null;
  designScore: number | null;
  readabilityScore: number | null;
};
