import bcrypt from 'bcryptjs';
import { storage } from './storage';

const SALT_ROUNDS = 10;
const SESSION_KEY = 'session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const security = {
  async hashPin(pin) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(pin, salt);
  },

  async verifyPin(pin, hash) {
    return bcrypt.compare(pin, hash);
  },

  async setupPin(pin) {
    const hash = await this.hashPin(pin);
    storage.set('pin_hash', hash);
    return hash;
  },

  async login(pin) {
    const hash = storage.get('pin_hash');
    if (!hash) return { success: false, error: 'No PIN set up' };
    
    const valid = await this.verifyPin(pin, hash);
    if (!valid) return { success: false, error: 'Invalid PIN' };
    
    const session = {
      loggedIn: true,
      timestamp: Date.now(),
      token: this.generateToken()
    };
    storage.set(SESSION_KEY, session);
    return { success: true };
  },

  logout() {
    storage.remove(SESSION_KEY);
  },

  isLoggedIn() {
    const session = storage.get(SESSION_KEY);
    if (!session || !session.loggedIn) return false;
    
    const elapsed = Date.now() - session.timestamp;
    if (elapsed > SESSION_TIMEOUT) {
      this.logout();
      return false;
    }
    
    session.timestamp = Date.now();
    storage.set(SESSION_KEY, session);
    return true;
  },

  isPinSetup() {
    return !!storage.get('pin_hash');
  },

  generateToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  getCsrfToken() {
    let token = storage.get('csrf_token');
    if (!token) {
      token = this.generateToken();
      storage.set('csrf_token', token);
    }
    return token;
  }
};

export default security;
