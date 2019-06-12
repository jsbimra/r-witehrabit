import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, NativeSelect, InputLabel, Input, Grid, TextField, IconButton, Button, Box, Typography } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DateFnsUtils from '@date-io/date-fns';
// import {format} from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

// console.log(format(new Date(2019,5,12), 'MM/dd/yyyy'));

const useStyles = makeStyles(theme => ({
    formControl: {
        fontSize: 14,
        width: '100%',
        marginBottom: 15,
    },
    headingStyle: {
        marginBottom: 15,
    },
    icon: {
        fontSize: 54,
    },
    hide: {
        display: 'none',
    },
    button: {
        margin: theme.spacing(1),
    }
}));

function RequestAppointment(props) {

    const [dateRequested, setDateRequested] = useState(new Date());
    const [timeRequested, setTimeRequested] = useState(new Date());

    const [formData, setFormData] = useState({
        errorStatus: false,
        clinicLocation: 'Fetching...',
        exam: '',
        notes: ''
    })
    const { handleNext } = props;

    const classes = useStyles();

    function handleInputChange(e) {
        const target = e.target;
        setFormData(oldData => ({
            ...oldData,
            [target.name]: target.value,
        }));
    }

    function handleDateChange(date) {
        setDateRequested(date);
    }

    function handleTimeChange(time) {
        setTimeRequested(time);
    }

    function triggerHandleNext(event) {
        // console.log('trigger handleNext', event.currentTarget.value);
        const newFormData = JSON.parse(event.currentTarget.value);
        newFormData['dateRequested'] = dateRequested;
        newFormData['timeRequested'] = timeRequested;

        handleNext(newFormData);
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
            setFormData(oldValues => {
                console.log('oldValues ', oldValues, 'data ', data);
                return ({
                    ...oldValues,
                    ['errorStatus']: false,
                    ['clinicLocation']: oldValues.clinicLocation !== data.results[0].components.city ? data.results[0].components.city : oldValues.clinicLocation,
                });
            });
            console.log('clinicLocation state value ', formData);
        });
    };

    const geoError = () => {
        setFormData(oldValues => {
            return ({
                ...oldValues,
                ['errorStatus']: true,
                ['clinicLocation']: "",
            });
        });
    }

    function geoLocationService() {
        if ("geolocation" in navigator) {
            console.log("Geo location");
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

        } else {
            alert('No geolocation available, please try on latest browser!')
        }
    }

    // function revokePermission() {
    //     console.log('revokePermission fired!', navigator.permissions);

    //     navigator.permissions.revoke({ name: 'geolocation' }).then(function (result) {
    //         console.log(result);
    //     });
    // }

    useEffect(() => {
        geoLocationService()
    }, []);

    return (
        <React.Fragment>
            <Typography variant="h4" component="h2" classes={{ root: classes.headingStyle }}>
                {props.title}
            </Typography>
            <form autoComplete="off">
                <Box color="error.main" my={2} display={formData.errorStatus ? 'block' : 'none'}>
                    Opp's sorry seems your geolocation is blocked.
                <br />To get nearyby clinic location please allow geolocation.
                {/* <Button variant="contained" color="primary" className={classes.button} onClick={revokePermission}>Allow Geolocation</Button> */}
                </Box>

                <FormControl classes={{ root: classes.formControl }}>
                    <InputLabel shrink htmlFor="clinicLocationId">
                        Clinic Location:
              </InputLabel>
                    <NativeSelect
                        variant="outlined"
                        classes={{ select: classes.select }}
                        value={formData.clinicLocation}
                        onChange={handleInputChange}
                        input={<Input name="clinicLocation" id="clinicLocationId" />}
                    >
                        <option value={formData.clinicLocation}>{formData.clinicLocation}</option>
                    </NativeSelect>
                </FormControl>

                <FormControl classes={{ root: classes.formControl }}>
                    <InputLabel shrink htmlFor="exam">
                        Exam:
              </InputLabel>
                    <NativeSelect
                        variant="outlined"
                        classes={{ select: classes.select }}
                        input={<Input name="exam" id="exam" value={formData.exam} onChange={handleInputChange} />}
                        inputProps={{ 'aria-label': 'exam' }}
                    >
                        <option value="">Select Exam</option>
                        <option value={'MRI'}>MRI</option>
                        <option value={'X-RAY'}>X-RAY</option>
                        <option value={'BLOOD TEST'}>BLOOD TEST</option>
                    </NativeSelect>
                </FormControl>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>

                    <FormControl classes={{ root: classes.formControl }}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="dateRequested"
                            label="Date Requested:"
                            name="dateRequested"
                            value={dateRequested}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </FormControl>
                    <FormControl classes={{ root: classes.formControl }}>
                        <KeyboardTimePicker
                            margin="normal"
                            id="timeRequested"
                            name="timeRequested"
                            label="Time requested:"
                            value={timeRequested}
                            onChange={handleTimeChange}
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
                    value={formData.notes}
                    onChange={handleInputChange}
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
                {'formData ' + JSON.stringify(formData)}

                <Grid container
                    direction="row"
                    justify="flex-end"
                    alignItems="center">
                    <Grid item>
                        <Button variant="contained" size="small" className={classes.button}
                            onClick={triggerHandleNext} value={JSON.stringify(formData)} disabled={!formData.errorStatus ? false : true}>
                            {/* <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} /> */}
                            Next
                    </Button>
                    </Grid>
                </Grid>
            </form>

        </React.Fragment>
    );
}

export default RequestAppointment;
