import { AppColors } from '../constants/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: AppColors.concealBlack,
  },
  viewContainer: {
    flex: 1,
    padding: '15rem',
    backgroundColor: AppColors.concealBlack,
  },
  pageWrapper: {
    flex: 1,
    backgroundColor: 'rgb(40, 45, 49)'
  },
  '@media (max-width: 499)': {
    appHeader: {
      height: '60rem',
      paddingTop: '0rem',
      borderBottomWidth: 1,
      backgroundColor: '#212529',
      borderBottomColor: '#343a40',
    }
  },
  '@media (min-width: 500)': {
    appHeader: {
      height: '60rem',
      paddingTop: '0rem',
      borderBottomWidth: 1,
      backgroundColor: '#212529',
      borderBottomColor: '#343a40',
    }
  },
  appHeaderWrapper: {
    flexDirection: 'row'
  },
  appHeaderText: {
    color: '#fff',
    fontSize: '20rem',
    marginRight: '10rem'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: '10rem',
  },
  loginView: {
    paddingTop: '40rem',
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: '30rem',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  textRegular: {
    fontFamily: 'Roboto',
    fontSize: '18rem',
    color: AppColors.text,
  },
  textSmall: {
    fontSize: '16rem',
  },
  textLarge: {
    fontSize: '18rem',
    textAlign: 'center'
  },
  textOrange: {
    fontFamily: 'Roboto',
    fontSize: '24rem',
    color: AppColors.concealOrange,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: '36rem',
    textAlign: 'center',
    color: AppColors.concealOrange,
  },
  textDanger: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: AppColors.errorText,
    backgroundColor: AppColors.errorBackground,
  },
  tabBar: {
    backgroundColor: 'rgb(25, 25, 25)',
    height: 60,
  },
  tabBarLabel: {
    fontFamily: 'Lato',
    fontSize: '14rem',
    lineHeight: '60rem',
  },
  tabBarIndicator: {
    backgroundColor: AppColors.concealOrange,
  },
  inputField: {
    width: '100%',
    height: '40rem',
    marginTop: '5rem',
    borderWidth: 0,
    marginBottom: '5rem',
    borderBottomWidth: 1,
    borderColor: 'rgb(50, 50, 50)',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: AppColors.concealOrange,
    margin: '10rem',
    paddingTop: '5rem',
    paddingBottom: '5rem',
    paddingLeft: '10rem',
    paddingRight: '10rem',
  },
  submitButtonDisabled: {
    borderColor: 'rgba(255, 165, 0, 0.3)',
    borderWidth: 1,
    backgroundColor: AppColors.concealBlack,
  },
  submitButtonLoading: {
    borderWidth: 0,
    backgroundColor: AppColors.concealBlack,
  },
  loginButton: {
    width: '100rem',
    height: '40rem',
  },
  buttonTitle: {
    color: 'rgb(0, 0, 0)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  buttonTitleDisabled: {
    color: 'rgb(75, 75, 75)',
  },
  guideTipContainer: {
    backgroundColor: '#FFFFFF'
  },
  guideTipText: {
    color: "#000000",
    fontSize: '18rem'
  },
  guideTipArrowLeft: {
    left: -10,
    top: '32%',
    marginTop: 10,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'rgba(255, 255, 255, 1)'
  },
  guideTipArrowRight: {
    right: -10,
    top: '32%',
    marginTop: 10,
    borderTopWidth: 10,
    borderLeftWidth: 10,
    borderBottomWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'rgba(255, 255, 255, 1)'
  },
  guideTipArrowBottom: {
    bottom: -10,
    left: '50%',
    marginLeft: 2.5,
    borderTopWidth: 10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255, 255, 255, 1)'
  },
  guideTipArrowTop: {
    top: -10,
    left: '50%',
    marginLeft: 2.5,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 1)'
  }
});
