import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField, IconButton, Button, Typography, Container, ButtonGroup, Box, Avatar, LinearProgress } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DateFnsUtils from '@date-io/date-fns';
import {format} from 'date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { TesseractWorker } from 'tesseract.js';


const useStyles = makeStyles(theme => ({
    formControl: {
        fontSize: 14,
        width: '100%',
        marginBottom: 15,
    },
    fieldContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 0
    },
    headingStyle: {
        marginBottom: 15,
    },
    input: {
        width: '48%',
        display: 'inline-block'
    },
    icon: {
        fontSize: 54,
    },
    hide: {
        display: 'none',
    },
    button: {
        marginTop: theme.spacing(6),
    },
    bigAvatar: {
        width: 120,
        height: 120
    }
}));

function CompleteRequestAppointment(props) {
    const ocrWorker = new TesseractWorker();
    const classes = useStyles();

    const [selectedDate, setSelectedDate] = React.useState(null);

    const { requestDetails } = props;

    
    const [progress, setProgress] = useState({
        updateProgress: 0,
        completed: false,
        show: false,
        ocrPanel: false,
        ocrStatus: null,
        ocrText: null,
    });

    const [formData, setFormData] = useState({
        errorStatus: false,
        fname: '',
        lname: '',
        valid: false,
        idProofImage: null
    });

    function hideOCRProgress(e) {
        if (e.currentTarget.textContent.toLowerCase() === 'hide') {
            ocrWorker.terminate();
            setProgress(ovalues => ({
                ...ovalues,
                ocrPanel: !ovalues.ocrPanel
            }));
        }
    }

    function handleInputChange(e) {
        const target = e.target;
        setFormData(oldData => ({
            ...oldData,
            [target.name]: target.value
        }));
    }

    function triggerHandleDateChange(date) {
        console.log('dob', date);
        setSelectedDate(date);
    }

    function handleRequestSubmitted(e) {
        e.preventDefault();

        // console.log(progress.ocrText);

        if (formData.fname === '' || formData.lname === '' || !selectedDate) {
            setFormData(oldData => ({
                ...oldData,
                errorStatus: true,
                valid: false,
            }));

        } else {
            setFormData(oldData => ({
                ...oldData,
                errorStatus: false,
                valid: true,
            }));
        }
    }

    function readImageFile() {
        var file = document.querySelector('#photoCameraUpload').files[0]; //sames as here
        var reader = new FileReader();

        reader.onloadend = function () {
            setFormData(oldValues => ({
                ...oldValues,
                idProofImage: reader.result
            }));

            if (reader.result) {

                setProgress(oldValues => ({
                    ...oldValues,
                    ocrPanel: !oldValues.ocrPanel,
                }));

                ocrWorker.recognize(reader.result)
                    .progress((p) => {
                        console.log('progress', p);
                        setProgress(oldValues => ({
                            ...oldValues,
                            ocrStatus: p.status,
                        }));
                    })
                    .then(({ text }) => {
                        console.log('JAT OCR', text);
                        setProgress(oldValues => ({
                            ...oldValues,
                            ocrText: text,
                        }));
                        ocrWorker.terminate();
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(resp => console.log(resp))
            }

            setProgress(oldValues => ({
                ...oldValues,
                show: !oldValues.show,
            }));
        }
        reader.onloadstart = function (event) {
            setProgress(oldValues => ({
                ...oldValues,
                show: !oldValues.show
            }));
        };

        reader.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentLoaded = Math.round((e.loaded / e.total) * 100);
                if (percentLoaded < 100) {
                    console.log('percentLoaded value inside if < 100', percentLoaded);
                    setProgress(oldValues => ({
                        ...oldValues,
                        updateProgress: percentLoaded
                    }));
                }
            }
        }

        if (file) {
            console.log('reading data as url');
            reader.readAsDataURL(file); //reads the data as a URL
        }
    }

    function handleImageUpload(event) {
        // const imagePath = event.currentTarget.value ?  event.currentTarget.value : null;
        readImageFile();
    }

    useEffect(() => {

        console.log('requestDetails ', requestDetails);

    }, []);

    function SuccessComp() {
        const reqDetails = requestDetails;
        const template = `${formData.fname} ${formData.lname}, we have successfully booked your appointment on ${format(reqDetails.dateRequested, 'Qo MMM yyyy', )} time ${reqDetails.timeRequested.getHours()}:${reqDetails.timeRequested.getMinutes()} at ${reqDetails.clinicLocation} for ${reqDetails.exam}`;
        return (<div>{template}</div>)
    }
    return (
        <React.Fragment>
            <Typography variant="h4" component="h2" classes={{ root: classes.headingStyle }}>
                {props.title}
            </Typography>

            <Box display={!formData.valid ? 'block' : 'none'} my={3}>
                <form autoComplete="off" noValidate>
                    <Box color="primary.main">
                        * Filed are required.
                    </Box>
                    <Box color="error.main" my={2} display={formData.errorStatus ? 'block' : 'none'}>
                        Please fill the form completely
                    </Box>

                    <Grid container
                        direction="row"
                        justify="space-between"
                        alignItems="center">

                        <input accept="image/*" className={classes.hide} id="photoCameraUpload"
                            capture="camera"
                            type="file"
                            onChange={handleImageUpload}
                            required />
                        <label htmlFor="photoCameraUpload">
                            Send us an ID (driving license, Aadhar card, etc ) *
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

                        {formData.idProofImage !== null ? (<Avatar alt="Remy Sharp" src={formData.idProofImage} className={classes.bigAvatar} />) : null}
                    </Grid>

                    {/* {`progress.updateProgress ` + progress.updateProgress} */}

                    {progress.show ? (<LinearProgress color="secondary" variant="determinate" value={progress.updateProgress} />) : null}

                    {progress.ocrPanel ? (<div>OCR status: {progress.ocrStatus}
                        <Box mt={2} mb={2}>{progress.ocrText !== null ? progress.ocrText :
                            <LinearProgress />}</Box> <Button variant="text" onClick={hideOCRProgress}>Hide</Button></div>) : ''}


                    <Container classes={{ root: classes.fieldContainer }}>
                        <TextField
                            name="fname"
                            id="fname"
                            label="First name"
                            placeholder="First name"
                            margin="normal"
                            value={formData.fname}
                            onChange={handleInputChange}
                            className={classes.input}
                            required
                        />
                        <TextField
                            name="lname"
                            id="lname"
                            label="Last name"
                            placeholder="Last name"
                            margin="normal"
                            value={formData.lname}
                            onChange={handleInputChange}
                            className={classes.input}
                            required
                        />
                    </Container>

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <FormControl>
                            <KeyboardDatePicker
                                margin="normal"
                                id="dobDatePicker"
                                label="Date of birth"
                                placeholder="Date of birth"
                                value={selectedDate}
                                onChange={triggerHandleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                            />
                        </FormControl>
                    </MuiPickersUtilsProvider>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box mt={9}>
                                <ButtonGroup fullWidth>
                                    <Button
                                        type="submit"
                                        onClick={handleRequestSubmitted}>
                                        {/* <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} /> */}
                                        Request Appointment
                            </Button>
                                </ButtonGroup>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Box display={formData.valid ? 'block' : 'none'} my={3}>
                <Typography variant="h4" >
                    Success
                </Typography>
                <Box my={2}>
                    <Typography variant="subtitle1" component="h5" color="textPrimary">
                        <SuccessComp />
                    </Typography>
                </Box>
            </Box>


        </React.Fragment >
    );
}

export default CompleteRequestAppointment;
