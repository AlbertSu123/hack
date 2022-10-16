import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import { Card, CardHeader, Divider, MenuItem, Select } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import { testTransaction } from "./test.js";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Starfield from "./Starfield";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const guardians = [
  "01node",
  "Certus One",
  "ChainLayer",
  "ChainodeTech",
  "Chorus One",
  "Everstake",
  "Figment",
  "Forbole",
  "FTX",
  "HashQuark",
  "Inotel",
  "MCF-V2-MAINNET",
  "MoonletWallet",
  "P2P Validator",
  "Staked",
  "Staking Facilities",
  "Staking Fund",
  "syncnode",
  "Triton",
];

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  input: {
    background: "rgba(255, 255, 255, 255)",
  },
}));

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: " ",
//       data: [
//         542, 0, 532, 549, 229, 0, 539, 549, 56, 123, 0, 548, 549, 544, 491, 449,
//         549, 549, 549,
//       ],
//       backgroundColor: "blue",
//     },
//   ],
// };

function App() {
  const [status, setStatus] = useState(0);
  const [chainId, setChainId] = useState(1);
  const [notional, setNotional] = useState(0);
  const [tabValue, setTabValue] = React.useState(0);
  const [guardianData, setGuardianData] = useState([]);

  useEffect(() => {
    setInterval(() => {
      fetch("http://143.198.69.169/api")
        .then((res) => res.json())
        // .then((data) => console.log(data));
        .then((data) => {
          setGuardianData(data);
          console.log(data);
        });
    }, 1000);
  }, []);

  var message = <Button></Button>;
  if (status == 1) {
    message = (
      <Button
        style={{
          color: "red",
        }}
      >
        Will fail
      </Button>
    );
  } else if (status == 2) {
    message = (
      <Button
        style={{
          color: "green",
        }}
      >
        Will succeed
      </Button>
    );
  }
  let currentTab;
  if (tabValue == 0) {
    currentTab = (
      <div className="mainBody">
        <Card
          variant="outlined"
          sx={{
            width: {
              sx: 1.0, // 100%
              sm: 500,
              md: 500,
            },
          }}
          FSUBMIG
          style={{ marginLeft: "40%" }}
        >
          <CardHeader
            title={"Simulate Wormhole Transaction"}
            titleColor={"Black"}
            titleStyle={{ textAlign: "center" }}
          ></CardHeader>
          <TextField
            style={{ color: "red" }}
            value={chainId}
            onChange={(e) => {
              setChainId(parseInt(e.target.value) || 0);
            }}
            id="chain-id"
            label="Chain ID"
            variant="filled"
          />
          {/* <Select
            variant="filled"
            label="Guardian"
            labelId="demo-simple-select-label"
            id="guardian"
            value={chainId}
            onChange={(e) => {
              setChainId(parseInt(e.target.value) || 0);
            }}
          >
            {guardians.map((g, i) => (
              <MenuItem value={i + 1}>{g}</MenuItem>
            ))}
          </Select> */}
          <Divider width={0}></Divider>
          <TextField
            value={notional}
            onChange={(e) => {
              setNotional(parseInt(e.target.value || 0));
            }}
            id="notional"
            label="Notional"
            variant="filled"
          />
          <Divider width={0}></Divider>
          <Button
            variant="contained"
            onClick={async () => {
              console.log(await testTransaction(notional, chainId));
              const result = await testTransaction(notional, chainId);
              console.log(result);
              if (result) {
                setStatus(1);
              } else {
                setStatus(2);
              }
            }}
          >
            {" "}
            Submit Notional
          </Button>
          <Divider width={0}></Divider>
          <Button>{message} </Button>
        </Card>

        {guardianData && (
          <Bar
            options={options}
            data={{
              labels: guardians,
              datasets: [
                {
                  label: " ",
                  data: guardianData,
                  backgroundColor: "#669BBC",
                },
              ],
            }}
          />
        )}
      </div>
    );
  } else if (tabValue == 1) {
    currentTab = <Button>Explorer Coming Soon!!</Button>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Starfield />
        </div>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => {
            setTabValue(newValue);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Governance" id="governance-tab" />
          <Tab label="Explorer" id="explorer-tab" />
        </Tabs>
        <div
          className="body"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            height: "90%",
            width: "100%",
            // backgroundImage:"url(/logo192.png)"
          }}
        >
          {currentTab}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
