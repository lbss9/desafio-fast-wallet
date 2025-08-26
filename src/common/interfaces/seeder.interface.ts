export interface ISeederConfig {
  tableName: string;
  connection?: any;
}

export interface ISeederData<T> {
  data: T[];
  shouldSave: boolean;
}
