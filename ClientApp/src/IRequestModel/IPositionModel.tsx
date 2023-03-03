import { IPositionLevelModel } from "./IPositionLevelModel";
import { SettingModel } from "./ISettingModel";

export interface IPositionModel extends SettingModel {
  PositionId: number;
  NameTh: string;
  NameEn: string;
  IsActive: boolean;
  PositionLevel: IPositionLevelModel;
}
