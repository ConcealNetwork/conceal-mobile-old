import React from 'react';
import { AppColors } from '../constants/Colors';
import { Col, Row, Grid } from "react-native-easy-grid";
import EStyleSheet from 'react-native-extended-stylesheet';
import { InterestRates } from '../helpers/utils';
import { Text } from "react-native";

export default function InterestTable({ interestClass }) {

  const renderTableHeader = () => {
    return (
      <Row style={styles.rowHeader}>
        <Col style={styles.colHeader}>
          <Text style={styles.headerText}>Month</Text>
        </Col>
        <Col style={styles.colHeader}>
          <Text style={styles.headerText}>Tier 1</Text>
        </Col>
        <Col style={styles.colHeader}>
          <Text style={styles.headerText}>Tier 2</Text>
        </Col>
        <Col style={styles.colHeader}>
          <Text style={styles.headerText}>Tier 3</Text>
        </Col>
      </Row>
    );
  }

  const renderTableRow = (month, interest) => {
    return (
      <Row style={styles.rowData}>
        <Col style={styles.colData}>
          <Text style={styles.dataText}>{month}</Text>
        </Col>
        {interest.map((value, index) => {
          return (
            <Col style={(interestClass != (month - 1) * 3 + (index + 1)) ? styles.colData : styles.colSelected}>
              <Text style={styles.dataText}>{interest[index].toFixed(2)}</Text>
            </Col>
          )
        })}
      </Row>
    );
  }

  return (
    <Grid style={styles.interestGrid}>
      {renderTableHeader()}
      {InterestRates.map((value, index) => {
        return renderTableRow(index + 1, InterestRates[index])
      })}
    </Grid>
  );
}

const styles = EStyleSheet.create({
  interestGrid: {
    marginBottom: '10rem',
    marginTop: '10rem',
    flexGrow: 2
  },
  rowHeader: {
    backgroundColor: AppColors.concealOrange,
    alignItems: 'center'
  },
  colHeader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colData: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  colSelected: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.concealOrange
  },
  headerText: {
    fontSize: '16rem',
    color: '#FFFFFF'
  },
  dataText: {
    fontSize: '14rem',
    color: '#FFFFFF'
  }
})