Cypress.Commands.add('login', (address = '0x123') => {
  cy.window().then((window) => {
    window.localStorage.setItem('web3-storage', JSON.stringify({
      address,
      lastConnectedChainId: 84532,
    }));
  });
});

Cypress.Commands.add('connectWallet', (address = '0x123') => {
  cy.window().then((window) => {
    window.ethereum = {
      request: () => Promise.resolve([address]),
      on: () => {},
      removeListener: () => {},
    };
  });
  
  cy.get('button').contains('Connect Wallet').click();
});
