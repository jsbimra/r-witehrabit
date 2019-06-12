import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, NativeSelect, InputLabel, Input, Grid, TextField, IconButton, Button } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
    formControl: {
        fontSize: 14,
        width: '100%',
        marginBottom: 15
    },
    textFieldArea: {
        width: '100%',
    },
    select: {
        width: '100%',
        // width: 'calc(100vw/3)',
    },
    icon: {
        fontSize: 54,
    },
    hide: {
        display: 'none'
    }
}));

function RequestAppointment(props) {
    // const [clinicLocation, setClinicLocation] = useState('');
    const [values, setValues] = useState({
        clinicLocation: 'Fetching...',
        exam: '',
        dateRequested: '',
        timeRequested: '',
        notes: ''
    })
    const { selectedDate, handleDateChange, handleNext } = props;

    const classes = useStyles();

    function triggerHandleDateChange(date) {
        handleDateChange(date)
    }

    function triggerHandleNext(event, nxtValue) {
        console.log('trigger handleNext', event, nxtValue);
        handleNext(event)
    }

    function getAddress(...cordinates) {
        const [lat, lon] = cordinates;
        console.log(lat, lon);

        const geo_api_key = "0b20195b02e04fd8963c083478cbf801";
        const api_url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geo_api_key}`;
        return fetch(api_url)
            .then(resp => resp.json());
    }
    const geoSuccess = position => {
        const { latitude: lat, longitude: lon } = position.coords;

        getAddress(lat, lon).then(data => {
            setValues(oldValues => {
                console.log('oldValues ', oldValues, 'data ', data);
                return ({
                    ...oldValues,
                    ['clinicLocation']: oldValues.clinicLocation !== data.results[0].components.city ? data.results[0].components.city : oldValues.clinicLocation,
                });
            });
            console.log('clinicLocation state value ', values);
        });
    };

    const geoError = () => {
        setValues(oldValues => {
            return ({
                ...oldValues,
                ['clinicLocation']: "Phoneix",
            });
        });
    }
    useEffect(() => {
        if ("geolocation" in navigator) {
            console.log("Geo location");
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

        } else {
            alert('No geolocation available, please try on latest browser!')
        }
    }, [])

    return (
        <form autoComplete="off">
            <FormControl classes={{ root: classes.formControl }}>
                <InputLabel shrink htmlFor="clinicLocationId">
                    Clinic Location:
              </InputLabel>
                <NativeSelect
                    variant="outlined"
                    classes={{ select: classes.select }}
                    value={values.clinicLocation}
                    input={<Input name="clinicLocation" id="clinicLocationId" />}
                >
                    <option value={values.clinicLocation}>{values.clinicLocation}</option>
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
                        onChange={triggerHandleDateChange}
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
                        onChange={triggerHandleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                </FormControl>
            </MuiPickersUtilsProvider>
            <TextField
                name="notes"
                id="notes"
                label="Notes"
                multiline
                rows="6"
                rowsMax="20"
                value="asfdsf"
                placeholder="Notes"
                margin="normal"
                className={classes.textFieldArea}
                classes={{ root: classes.formControl }}
            />
            <input accept="image/*" className={classes.hide} id="photoCameraUpload" type="file" />
            <label htmlFor="photoCameraUpload">
                Have a doctor's order? Send us pics:
              <br />
                <IconButton
                    color="primary"
                    className={classes.icon}
                    aria-label="Upload picture"
                    component="span"
                >
                    <PhotoCamera className={classes.icon} />
                </IconButton>
            </label>
            <Grid container
                direction="row"
                justify="flex-end"
                alignItems="center">
                <Grid item>
                    <Button variant="contained" size="small" className={classes.button}
                        onClick={triggerHandleNext} value="collectIdentityInfo">
                        {/* <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} /> */}
                        Next
                    </Button>
                </Grid>
            </Grid>
        </form>

    );
}

export default RequestAppointment;
