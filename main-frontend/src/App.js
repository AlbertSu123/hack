import './App.css'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/TextField'
import Tabs from '@mui/material/Tabs'
import { Card, CardHeader, Divider } from '@mui/material'
import Tab from '@mui/material/Tab'
import { testTransaction } from './test.js'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  input: {
    background: 'rgba(255, 255, 255, 255)',
  },
}))

function App() {
  const [status, setStatus] = useState(0)
  const [chainId, setChainId] = useState(1)
  const [notional, setNotional] = useState(0)
  const [tabValue, setTabValue] = React.useState(0)
  var message = <Button></Button>
  if (status == 1) {
    message = (
      <Button
        style={{
          color: 'red',
        }}
      >
        Will fail
      </Button>
    )
  } else if (status == 2) {
    message = (
      <Button
        style={{
          color: 'green',
        }}
      >
        Will succeed
      </Button>
    )
  }
  let currentTab
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
        >
          <CardHeader
            title={'Hi'}
            titleColor={'Black'}
            titleStyle={{ textAlign: 'center' }}
          ></CardHeader>
          <TextField
            style={{ color: 'red' }}
            value={chainId}
            onChange={(e) => {
              setChainId(parseInt(e.target.value))
            }}
            id="chain-id"
            label="Chain ID"
            variant="filled"
          />
          <Divider></Divider>
          <TextField
            value={notional}
            onChange={(e) => {
              setNotional(parseInt(e.target.value))
            }}
            id="notional"
            label="Notional"
            variant="filled"
          />
          <Divider></Divider>
          <Button
            variant="contained"
            onClick={async () => {
              console.log(await testTransaction(notional, chainId))
              const result = await testTransaction(notional, chainId)
              console.log(result)
              if (result) {
                setStatus(1)
              } else {
                setStatus(2)
              }
            }}
          >
            {' '}
            Submit Notional
          </Button>
        </Card>
        {message}
      </div>
    )
  } else if (tabValue == 1) {
    currentTab = <Button>Explorer Coming Soon!!</Button>
  }

  return (
    <div className="App">
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => {
          setTabValue(newValue)
        }}
        aria-label="basic tabs example"
      >
        <Tab label="Governance" id="governance-tab" />
        <Tab label="Explorer" id="explorer-tab" />
      </Tabs>
      <div
        className="body"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          height: '90%',
          width: '100%',
          // backgroundImage:"url(/logo192.png)"
        }}
      >
        {currentTab}
      </div>
    </div>
  )
}

export default App
