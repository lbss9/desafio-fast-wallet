export class SeederError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SeederError';
  }
}

export class DataSourceNotConfiguredError extends SeederError {
  constructor() {
    super(
      'DataSource não configurado. Use BaseSeeder.setDataSource(dataSource, configService)',
    );
  }
}

export class EnvironmentError extends SeederError {
  constructor() {
    super('Seeder só pode ser usado em ambiente de desenvolvimento ou teste');
  }
}

export class LocalhostOnlyError extends SeederError {
  constructor() {
    super('Seeder só pode ser usado com conexões localhost');
  }
}

export class EntityNotConfiguredError extends SeederError {
  constructor() {
    super(
      'Entity não configurada. Use o decorator @HydrateSeeder(EntityClass)',
    );
  }
}
