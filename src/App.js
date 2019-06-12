import React from 'react';
import CSSBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import RequestAppointment from './components/RequestAppoitnment';

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
  const [selectedDate, setSelectedDate] = React.useState(new Date('2019-06-11T21:16:54'));

  function handleDateChange(date) {
    // console.log('date selected', date);
    setSelectedDate(date);
  }

  function handleNext(nextView) {
    console.log('Handle Next button ', nextView);
  }

  return (
    <React.Fragment>
      <CSSBaseline />
      <Container maxWidth="sm" className="App" classes={{ root: classes.root }}>
        <header className="App-header">

          <Typography variant="subtitle2" component="h1" classes={{root: classes.headingStyle}}>
            <span className="logo"><span className="character">P</span></span> Peninsula Diagnostic Imaging
          </Typography>
          <Typography variant="h4" component="h2" classes={{root: classes.headingStyle}}>
            Request an appointment
          </Typography>

        </header>

        <RequestAppointment handleNext={handleNext} handleDateChange={handleDateChange} selectedDate={selectedDate} />

      </Container>
    </React.Fragment>
  );
}

export default App;
