import React, { Fragment, useEffect, useState } from "react";
import {
  PDFViewer,
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import axiosClient from "../../axios/axiosClient";
import { Box, Typography } from "@mui/material";
import cairoFont from "../../font/static/Cairo-Regular.ttf";

const StatisticsReport = ({ fromDate, toDate }) => {
  const [labConstants, setLabConstants] = useState({});
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const getLabConstanse = () => {
    axiosClient.get(`/LaboratoryConstant`).then((res) => {
      setLabConstants(res.data[0]);
    });
  };
  const getAnalyseDetail = () => {
    axiosClient
      .post(`/Statistics/countByTestName`, {
        fromDate,
        toDate,
      })
      .then((res) => {
        setTests(res.data);
        setLoading(false);
      });
  };
  useEffect(() => {
    getLabConstanse();
    getAnalyseDetail();
  }, []);
  useEffect(() => {
    getAnalyseDetail();
  }, [fromDate]);

  Font.register({
    family: "Cairo",
    src: cairoFont,
  });

  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
    },

    spaceBetween: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#3E3E3E",
    },

    titleContainer: { flexDirection: "row", marginTop: 24 },

    logo: { width: 120 },

    reportTitle: { fontSize: 16, textAlign: "center", fontFamily: "Cairo" },

    addressTitle: { fontSize: 11, fontStyle: "bold", marginBottom: 5 },

    invoice: { fontWeight: "bold", fontSize: 20, fontFamily: "Cairo" },

    invoiceNumber: {
      fontSize: 11,
      fontWeight: "bold",
      marginTop: 10,
      borderBottom: "1px solid #DEDEDE",
    },

    address: { fontWeight: 400, fontSize: 10 },

    theader: {
      marginTop: 20,
      fontSize: 10,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
      backgroundColor: "#DEDEDE",
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
      fontFamily: "Cairo",
    },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    total: {
      fontSize: 12,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 7,
      flex: 3,
      borderColor: "whitesmoke",
      borderBottomWidth: 1,
      borderTop: "1px solid #777",
      marginTop: 10,
    },
    totalNum: {
      fontSize: 12,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 7,
      flex: 1,
      borderColor: "whitesmoke",
      borderBottomWidth: 1,
      borderTop: "1px solid #777",
      marginTop: 10,
    },

    tbody2: { flex: 2, borderRightWidth: 1 },
    border: {
      width: 520,
      height: "1px",
      marginTop: "10px",
      backgroundColor: "whitesmoke",
    },
    category: {
      width: 515,
      marginTop: "10px",
      border: "1px solid #DEDEDE",
      backgroundColor: "whitesmoke",
      fontFamily: "Cairo",
    },
  });

  const ReportTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Image style={styles.logo} src={"https://thumbs.dreamstime.com/b/print-173735684.jpg"} />
        <Text style={styles.invoice}>{labConstants.hospitalName}</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Text> </Text>
        <View>
          <Text style={styles.reportTitle}>{labConstants.address}</Text>
          <Text style={styles.invoiceNumber}> 0930202105 - 2631630 - 2631640 </Text>
        </View>
      </View>
    </View>
  );
  const Date = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View style={styles.theader}>
          <Text>لتاريخ {toDate.toString()}</Text>
        </View>
        <View style={styles.theader}>
          <Text>من تاريخ: {fromDate.toString()}</Text>
        </View>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text>التحاليل</Text>
      </View>
      <View style={styles.theader}>
        <Text>العدد</Text>
      </View>
      <View style={styles.theader}>
        <Text>السعر</Text>
      </View>
    </View>
  );

  const TableBody = () =>
    tests.map((el) => {
      return (
        <Fragment key={el.id}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={[styles.tbody, styles.tbody2]}>
              <Text>{el.testName}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{el.count} </Text>
            </View>
            <View style={styles.tbody}>
              <Text>{(labConstants.priceOfUnit * el.nuint).toFixed(2)}</Text>
            </View>
          </View>
        </Fragment>
      );
    });
  let r = 0;
  const TableTotal = () => (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <View style={styles.total}>
        <Text>Total</Text>
      </View>
      <View style={styles.totalNum}>
        <Text>
          {tests.reduce((s, el) => s + el.nuint * el.count * labConstants.priceOfUnit, 0)}
          S.P
        </Text>
      </View>
    </View>
  );

  return (
    <Box>
      {loading ? (
        <></>
      ) : (
        <PDFViewer width="1000" height="650" className="app">
          <Document title="Report">
            <Page size="A4" style={styles.page}>
              <ReportTitle />
              <Address />
              <Date />
              {/* <UserAddress /> */}
              <TableHead />
              <TableBody />
              <TableTotal />
            </Page>
          </Document>
        </PDFViewer>
      )}
    </Box>
  );
};
export default StatisticsReport;
