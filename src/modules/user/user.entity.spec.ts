import { User, UserProps } from './user.entity';
import { UserFixtures } from './fixtures/user.fixture';

describe('User Entity', () => {
  describe('Creation & Getters', () => {
    it('should correctly initialize and return properties via getters', () => {
      const props = UserFixtures.props();
      const user = new User(props);

      expect(user.id).toBe(props.id);
      expect(user.name).toBe(props.name);
      expect(user.phone).toBe(props.phone);
      expect(user.email).toBe(props.email);
      expect(user.password).toBe(props.password);
      expect(user.role).toBe(props.role);
      expect(user.isPhoneVerified).toBe(false);
      expect(user.isEmailVerified).toBe(false);
      expect(user.createdAt).toBe(props.createdAt);
      expect(user.updatedAt).toBe(props.updatedAt);
    });
  });

  describe('changeName()', () => {
    it('should successfully change the name if it is 3 or more characters long', () => {
      const user = new User(UserFixtures.props({ name: 'Old Name' }));

      user.changeName('New Name');

      expect(user.name).toBe('New Name');
    });

    it('should throw an error if the new name is less than 3 characters long', () => {
      const user = new User(UserFixtures.props({ name: 'Valid Name' }));

      expect(() => user.changeName('Jo')).toThrow(
        'Name must be at least 3 characters long',
      );

      expect(user.name).toBe('Valid Name');
    });
  });

  describe('verifyPhone()', () => {
    it('should change isVerified to true if it was false', () => {
      const user = new User(UserFixtures.props({ isPhoneVerified: false }));

      user.verifyPhone();

      expect(user.isPhoneVerified).toBe(true);
    });

    it('should do nothing and remain true if user is already verified', () => {
      const user = new User(UserFixtures.props({ isPhoneVerified: true }));

      user.verifyPhone();

      expect(user.isPhoneVerified).toBe(true);
    });
  });
});
