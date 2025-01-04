import '@cypress/code-coverage/support';
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(address?: string): Chainable<void>;
      connectWallet(address?: string): Chainable<void>;
    }
  }
}
