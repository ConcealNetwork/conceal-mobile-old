import { StyleSheet } from 'react-native';
import { colors } from '../constants/Colors';


export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.concealBlack,
  },
  viewContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.concealBlack,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  loginView: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  textRegular: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: colors.text,
  },
  textSmall: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 20,
  },
  textOrange: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: colors.concealOrange,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 36,
    color: colors.concealOrange,
  },
  textDanger: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: colors.errorText,
    backgroundColor: colors.errorBackground,
  },
  tabBar: {
    backgroundColor: 'rgb(25, 25, 25)',
    height: 60,
  },
  tabBarLabel: {
    fontFamily: 'Lato',
    fontSize: 14,
    lineHeight: 60,
  },
  tabBarIndicator: {
    backgroundColor: colors.concealOrange,
  },
  loginInput: {
    textAlign: 'center'
  },
  inputField: {
    width: '100%',
    height: 40,
    marginTop: 5,
    borderWidth: 0,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'rgb(50, 50, 50)',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: colors.concealOrange,
    margin: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  submitButtonDisabled: {
    borderColor: 'rgba(255, 165, 0, 0.3)',
    borderWidth: 1,
    backgroundColor: colors.concealBlack,
  },
  submitButtonLoading: {
    borderWidth: 0,
    backgroundColor: colors.concealBlack,
  },
  loginButton: {
    width: 100,
    height: 40,
  },
  buttonTitle: {
    color: 'rgb(0, 0, 0)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  buttonTitleDisabled: {
    color: 'rgb(75, 75, 75)',
  },
});
