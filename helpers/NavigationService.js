import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function goBack(steps) {
  for (let i = 0; i < (steps ? steps : 1); i++) {
    _navigator.dispatch(
      NavigationActions.back()
    );
  }
}

export default {
  goBack,
  navigate,
  setTopLevelNavigator,
};
