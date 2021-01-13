enum Environments {
  local_environment = 'local',
  dev_environment = 'dev',
  prod_environment = 'prod',
  qa_environment = 'qa'
}

class Environment {
  private environment: String;

  constructor(environment: String) {
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
          return 3002;
      }
  }

  getVolumnPath(): String {
    if (this.environment === Environments.local_environment) {
        //const path = require('path');
        //return path.resolve(__dirname, '../../volume');
        return '/var/lib/video';
    }
  }
}

export default new Environment(Environments.local_environment);