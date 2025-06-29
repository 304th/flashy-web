class Token {
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  setAccessToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token);
  }

  removeAccessToken() {
    localStorage.removeItem('access_token');
  }

  removeRefreshToken() {
    localStorage.removeItem('access_token');
  }
}

export const token = new Token();