enum Environments {
  local_environment = 'local',
  dev_environment = 'dev',
  prod_environment = 'prod',
  qa_environment = 'qa'
}

class Environment {
  private environment: string;

  constructor(environment: string) {
      this.environment = environment;
  }

  getPort(): Number {
      if (this.environment === Environments.prod_environment) {
          return 8081;
      } else if (this.environment === Environments.dev_environment) {
          return 8082;
      } else if (this.environment === Environments.qa_environment) {
          return 8083;
      } else {
          return 3001;
      }
  }

  getVolumnPath(): string {
    if (this.environment === Environments.local_environment) {
        //const path = require('path');
        //return path.resolve(__dirname, '../../volume');
        return '/var/lib/video';
    } else {
        return 'Error no environment volumnPath';
    }

  }
}

export default new Environment(Environments.local_environment);