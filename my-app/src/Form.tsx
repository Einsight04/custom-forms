import React, {useState} from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const useStyles = {
    paper: {
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 2,
        paddingRight: 2
    },
    title: {
        marginTop: 1,
        marginBottom: 1
    },
    field: {
        marginTop: '1rem',
        marginBottom: 1
    }
}

const Form = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const [label1Exists, setLabel1Exists] = useState(false);
    const [label2Exists, setLabel2Exists] = useState(false);
    const [label3Exists, setLabel3Exists] = useState(false);
    const [label4Exists, setLabel4Exists] = useState(false);
    const [label1, setLabel1] = useState('');
    const [label2, setLabel2] = useState('');
    const [label3, setLabel3] = useState('');
    const [label4, setLabel4] = useState('');
    const [label1Error, setLabel1Error] = useState(false);
    const [label2Error, setLabel2Error] = useState(false);
    const [label3Error, setLabel3Error] = useState(false);
    const [label4Error, setLabel4Error] = useState(false);

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [signInError, setSignInError] = useState(false);
    const [error, setError] = useState(false);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setSignInError(false);
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        setError(false);

        if (!firstName) {
            setFirstNameError(true);
            setSending(false);
            setError(true);
        }

        if (!lastName) {
            setLastNameError(true);
            setSending(false);
            setError(true);
        }

        if (!email) {
            setEmailError(true);
            setSending(false);
            setError(true);
        }

        if (firstName && lastName && email) {
            try {
                const response = await fetch('http://localhost:3600/api/sign-in', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email
                    })
                });
                const data = await response.json();
                const {status, labels} = data;

                if (status === 'failure') {
                    console.log('failure');
                    setSignInError(true);
                    setSending(false);
                    return
                }

                setSignInError(false);
                setError(false);
                setSending(false);
                setLoggedIn(true);
                setLabel1Exists(labels.label1);
                setLabel2Exists(labels.label2);
                setLabel3Exists(labels.label3);
                setLabel4Exists(labels.label4);
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Fetch Aborted');
                    return;
                }
                setError(false);
                setSending(false);
            }
        }
    };

    const handleDataSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let error: boolean = false;

        setSending(true);
        setSent(false);
        setLabel1Error(false);
        setLabel2Error(false);
        setLabel3Error(false);
        setLabel4Error(false);
        setError(false);

        if (!label1 && label1Exists) {
            setLabel1Error(true);
            setSending(false);
            setError(true);
            error = true;
        }

        if (!label2 && label2Exists) {
            console.log('label2');
            setLabel2Error(true);
            setSending(false);
            setError(true);
            error = true;
        }

        if (!label3 && label3Exists) {
            setLabel3Error(true);
            setSending(false);
            setError(true);
            error = true;
        }

        if (!label4 && label4Exists) {
            setLabel4Error(true);
            setSending(false);
            setError(true);
            error = true;
        }

        if (error) {
            return;
        }

        try {
            await fetch('http://localhost:3600/api/form-submission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    label1,
                    label2,
                    label3,
                    label4
                })
            });

            setError(false);
            setSending(false);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Fetch Aborted');
                return;
            }
            setError(false);
            setSending(false);
        }

        setSending(false);
        setSent(true);
    }

    return (
        <Container>
            {!loggedIn &&
                <Box>
                    <Typography
                        sx={useStyles.title}
                        variant='h6'
                        align='center'
                    >
                        PLEASE SIGN IN WITH YOUR INFO
                    </Typography>
                    <form noValidate autoComplete="off" onSubmit={handleSignIn}>
                        <Paper elevation={3} sx={useStyles.paper}>
                            <TextField
                                onChange={(e) => setFirstName(e.target.value)}
                                id="filled-basic"
                                label="FIRST NAME"
                                variant="filled"
                                required
                                error={firstNameError}
                                sx={{width: `calc(50% - 0.3rem)`, marginTop: 1, marginRight: '0.3rem'}}
                            />
                            <TextField
                                onChange={(e) => setLastName(e.target.value)}
                                id="filled-basic"
                                label="LAST NAME"
                                variant="filled"
                                required
                                error={lastNameError}
                                sx={{width: `calc(50% - 0.3rem)`, marginTop: 1, marginLeft: '0.3rem'}}
                            />
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                sx={useStyles.field}
                                id="filled-basic"
                                label="EMAIL"
                                variant="filled"
                                fullWidth
                                required
                                error={emailError}
                            />
                        </Paper>
                        <LoadingButton
                            type="submit"
                            sx={{marginTop: '1rem'}}
                            color={error ? 'error' : signInError ? 'error' : 'primary'}
                            variant="contained"
                            fullWidth
                            endIcon={<KeyboardArrowRightIcon/>}
                            loading={sending}
                        >
                            {sending ? 'Sending...' : 'Send'}
                        </LoadingButton>
                        {error && <Typography sx={useStyles.title}
                                              variant='subtitle1'
                                              color='error'
                                              gutterBottom
                        >
                            {'Please fill out necessary fields'.toUpperCase()}
                        </Typography>}
                        {signInError && <Typography sx={useStyles.title}
                                              variant='subtitle1'
                                              color='error'
                                              gutterBottom
                        >
                            {'Account does not exist'.toUpperCase()}
                        </Typography>}
                    </form>
                </Box>
            }
            {loggedIn &&
                <Box>
                    <Typography
                        sx={useStyles.title}
                        variant='h6'
                        align='center'
                    >
                        PLEASE FILL OUT THE FOLLOWING FORM
                    </Typography>
                    <form noValidate autoComplete="off" onSubmit={handleDataSubmit}>
                        <Paper elevation={3} sx={useStyles.paper}>
                            {label1Exists &&
                                <TextField
                                    onChange={(e) => setLabel1(e.target.value)}
                                    sx={useStyles.field}
                                    id="filled-basic"
                                    label="LABEL 1"
                                    variant="filled"
                                    fullWidth
                                    required
                                    error={label1Error}
                                />
                            }
                            {label2Exists &&
                                <TextField
                                    onChange={(e) => setLabel2(e.target.value)}
                                    sx={useStyles.field}
                                    id="filled-basic"
                                    label="LABEL 2"
                                    variant="filled"
                                    fullWidth
                                    required
                                    error={label2Error}

                                />
                            }
                            {label3Exists &&
                                <TextField
                                    onChange={(e) => setLabel3(e.target.value)}
                                    sx={useStyles.field}
                                    id="filled-basic"
                                    label="LABEL 3"
                                    variant="filled"
                                    fullWidth
                                    required
                                    error={label3Error}
                                />
                            }
                            {label4Exists &&
                                <TextField
                                    onChange={(e) => setLabel4(e.target.value)}
                                    sx={useStyles.field}
                                    id="filled-basic"
                                    label="LABEL 4"
                                    variant="filled"
                                    fullWidth
                                    required
                                    error={label4Error}
                                />
                            }
                        </Paper>
                        <LoadingButton
                            type="submit"
                            sx={{marginTop: '1rem'}}
                            color={error ? 'error' : 'primary'}
                            variant="contained"
                            fullWidth
                            endIcon={<KeyboardArrowRightIcon/>}
                            loading={sending}
                        >
                            {sending ? 'Sending...' : 'Send'}
                        </LoadingButton>
                        {error && <Typography sx={useStyles.title}
                                              variant='subtitle1'
                                              color='error'
                                              gutterBottom
                        >
                            {'Please fill out necessary fields'.toUpperCase()}
                        </Typography>}
                    </form>
                </Box>
            }
        </Container>

    );
};

export default Form;
