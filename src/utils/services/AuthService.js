import Amplify, { Auth } from 'aws-amplify';
import { logoutSuccess } from './../../redux/auth/authActions';
import { store } from './../../redux/store';

const options = {
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_CLIENT_ID,
  },
};
Amplify.configure(options);

class AuthService {
  // constructor() {
  //   Hub.listen('auth', (data) => {
  //     const { payload } = data;
  //     console.log('data', data);
  //   });
  // }

  signUp({ email, password, phone_number, isPhone }) {
    return Auth.signUp({
      username: email,
      password,
      attributes: isPhone ? { phone_number } : null,
    });
  }

  logIn({ email, password }) {
    return Auth.signIn(email, password);
  }

  logOut() {
    store.dispatch(logoutSuccess());
    return Auth.signOut();
  }

  confirmSignUp({ email, code }) {
    return Auth.confirmSignUp(email, code);
  }

  resendConfirmationCode(email) {
    return Auth.resendSignUp(email);
  }

  forgotPassword(email) {
    return Auth.forgotPassword(email);
  }

  confirmNewPassword({ email, code, newPassword }) {
    return Auth.forgotPasswordSubmit(email, code, newPassword);
  }

  autoLogOut() {
    // const time = 60000 * 15;
    // const logOutUser = () => {
    //   this.logOut();
    //   observer.disconnect();
    // };
    // let withActive = setTimeout(logOutUser, time);
    // const config = { attributes: true, childList: true, subtree: true };
    // const callback = function (mutationsList, observer) {
    //   clearTimeout(withActive);
    //   withActive = setTimeout(logOutUser, time);
    // };
    // const observer = new MutationObserver(callback);
    // observer.observe(document, config);
  }

  get currentUser() {
    return Auth.currentUserPoolUser();
  }

  async isAuthUser() {
    try {
      const user = await Auth.currentUserInfo();
      return !!Object.keys(user).length;
    } catch (err) {
      return false;
    }
  }
}

export default new AuthService();
