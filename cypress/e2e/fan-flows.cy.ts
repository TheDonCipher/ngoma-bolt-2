describe('Fan User Flows', () => {
  beforeEach(() => {
    cy.login();
  });

  describe('Music Discovery', () => {
    it('should search for tracks', () => {
      cy.visit('/explore');
      cy.get('input[placeholder*="Search"]').type('test track');
      cy.get('button[aria-label="Search"]').click();
      cy.contains('test track').should('be.visible');
    });

    it('should filter tracks by genre', () => {
      cy.visit('/explore');
      cy.get('select[name="genre"]').select('Afrobeats');
      cy.get('[data-testid="track-card"]').should('have.length.gt', 0);
    });

    it('should play a track', () => {
      cy.visit('/explore');
      cy.get('[data-testid="play-button"]').first().click();
      cy.get('[data-testid="audio-player"]').should('be.visible');
    });
  });

  describe('NFT Collection', () => {
    it('should purchase a track NFT', () => {
      cy.visit('/explore');
      cy.get('[data-testid="buy-button"]').first().click();
      cy.get('[data-testid="confirm-purchase"]').click();
      cy.contains('Purchase successful').should('be.visible');
    });

    it('should view NFT library', () => {
      cy.visit('/dashboard/fan/collection');
      cy.get('[data-testid="nft-card"]').should('have.length.gt', 0);
    });
  });

  describe('Badge System', () => {
    it('should earn badges based on activity', () => {
      cy.visit('/dashboard/fan/badges');
      cy.get('[data-testid="badge-card"]').should('have.length.gt', 0);
    });

    it('should view achievement progress', () => {
      cy.visit('/dashboard/fan/badges');
      cy.get('[data-testid="progress-bar"]').should('be.visible');
    });
  });
});
