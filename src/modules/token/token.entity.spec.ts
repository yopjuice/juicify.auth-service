import { Token } from './token.entity';
import { TokenFixtures } from './fixtures/token.fixture';

describe('Token Entity', () => {
  describe('Creation & Getters', () => {
    it('should correctly initialize and return properties via getters', () => {
      const props = TokenFixtures.props();
      const token = new Token(props);

      expect(token.id).toBe(props.id);
      expect(token.tokenHash).toBe(props.tokenHash);
      expect(token.createdAt).toBe(props.createdAt);
      expect(token.updatedAt).toBe(props.updatedAt);
    });
  });

});
