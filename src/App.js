import React from 'react';
import CSSBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { FormControl, NativeSelect, InputLabel, Input, Grid, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles({
  root: {
    paddingTop: '20px',
  },
  formControl: {
    fontSize: 14,
    width: '100%',
    marginBottom: 15
  },
  select: {
    width: '100%',
    // width: 'calc(100vw/3)',
  }
})
function App() {

  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date('2019-06-11T21:16:54'));

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  return (
    <React.Fragment>
      <CSSBaseline />
      <Container maxWidth="sm" className="App" classes={{ root: classes.root }} >
        <header className="App-header">

          <Typography variant="subtitle2" component="h1" gutterBottom >
            Peninsula Diagnostic Imaging
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Request an appointment
          </Typography>

        </header>

        <form autoComplete="off">
          <FormControl classes={{ root: classes.formControl }}>
            <InputLabel shrink htmlFor="clinicLocationId">
              Clinic Location:
              </InputLabel>
            <NativeSelect
              variant="outlined"
              classes={{ select: classes.select }}
              input={<Input name="clinicLocation" id="clinicLocationId" />}
              inputProps={{ 'aria-label': 'location' }}
            >
              <option value={'Phoenix'}>Phoenix</option>
              <option value={'Idhao'}>Idhao</option>
              <option value={'Mountain view'}>Mountain view</option>
            </NativeSelect>
          </FormControl>

          <FormControl classes={{ root: classes.formControl }}>
            <InputLabel shrink htmlFor="examId">
              Exam:
              </InputLabel>
            <NativeSelect
              variant="outlined"
              classes={{ select: classes.select }}
              input={<Input name="exam" id="examId" />}
              inputProps={{ 'aria-label': 'exam' }}
            >
              <option value={'MRI'}>MRI</option>
              <option value={'XRAY'}>X-RAY</option>
              <option value={'BT'}>BLOOD TEST</option>
            </NativeSelect>
          </FormControl>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <FormControl classes={{ root: classes.formControl }}>
              <KeyboardDatePicker
                margin="normal"
                id="mui-pickers-date"
                label="Date Requested:"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </FormControl>
            <FormControl classes={{ root: classes.formControl }}>
              <KeyboardTimePicker
                margin="normal"
                id="mui-pickers-time"
                label="Time requested:"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </FormControl>
          </MuiPickersUtilsProvider>

          <FormControl classes={{ root: classes.formControl }}>
            <TextField
              id="notes"
              label="Notes"
              multiline
              rowsMax="4"
              value=""
              placeholder="Notes"
              margin="normal"
            />
          </FormControl>
        </form>
      </Container>
    </React.Fragment >
  );
}

export default App;
