import React, { useState } from 'react';
import CSSBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import RequestAppointment from './components/RequestAppoitnment';
import CompleteRequestAppointment from './components/CompleteRequestAppointment';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '30px',
    paddingBottom: '30px',
  },
  headingStyle: {
    marginBottom: 15,
  }
}));

function App() {

  const classes = useStyles();
  const [nextView, setNextView] = useState(false);
  const [requestDetails, setRequestDetails] = useState(null);

  function handleNext(formData) {
    console.log('Handle Next button ', formData);
    console.log(formData);

    if (formData) {
      setRequestDetails(formData);
      setNextView(!nextView);
    }
  }

  function renderViews(nextView) {
    if(nextView) {
      return (<CompleteRequestAppointment title="Fill in your info" requestDetails={requestDetails} />)
    } else {
      return (<RequestAppointment title="Request an appointment" handleNext={handleNext} />)
    }
  }

  return (
    <React.Fragment>
      <CSSBaseline />
      <Container maxWidth="sm" className="App" classes={{ root: classes.root }}>
        <header className="App-header">
          <Typography variant="subtitle2" component="h1" classes={{ root: classes.headingStyle }}>
            <a href="/" className="logo-link"><span className="logo"><span className="character">P</span></span> Peninsula Diagnostic Imaging</a>
          </Typography>
        </header>

        {renderViews(nextView)}
        
      </Container>
    </React.Fragment>
  );
}

export default App;
