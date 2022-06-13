import React, {useState} from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const useStyles = {
    paper: {
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 2,
        paddingRight: 2
    },
    box: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 1,
    },
    boxText: {
        marginRight: 3
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

const GenerateForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const [label1Checked, setLabel1Checked] = useState(false);
    const [label2Checked, setLabel2Checked] = useState(false);
    const [label3Checked, setLabel3Checked] = useState(false);
    const [label4Checked, setLabel4Checked] = useState(false);

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        setError(false);

        if (!firstName) {
            setFirstNameError(true);
            setSending(false);
            setSent(false);
            setError(true);
        }

        if (!lastName) {
            setLastNameError(true);
            setSending(false);
            setSent(false);
            setError(true);
        }

        if (!email) {
            setEmailError(true);
            setSending(false);
            setSent(false);
            setError(true);
        }

        if (!label1Checked && !label2Checked && !label3Checked && !label4Checked) {
            setSending(false);
            setSent(false);
            setError(true);
        }

        if (firstName && lastName && email && (label1Checked || label2Checked || label3Checked || label4Checked)) {
            try {
                console.log('submitting 2');
                const response: Response = await fetch('http://localhost:3600/api/form-data', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        labels: {
                            label1: label1Checked,
                            label2: label2Checked,
                            label3: label3Checked,
                            label4: label4Checked,
                        }
                    })
                });

                const {status} = await response.json();

                if (status !== 200) {
                    setError(true);
                    setSending(false);
                    setSent(false);
                    return;
                }
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Fetch Aborted');
                    return;
                }
                setError(false);
                setSending(false);
                setSent(false);
            }

            setSending(false);
            setSent(true);
            setError(false);
        }
    };

    return (
        <Container>
            <Typography
                sx={useStyles.title}
                variant='h6'
                align='center'
            >GENERATE FORM
            </Typography>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
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
                    <FormGroup>
                        <FormControlLabel
                            label="Label1"
                            control={
                                <Checkbox
                                    checked={label1Checked}
                                    onChange={(e) => setLabel1Checked(e.target.checked)}
                                />
                            }
                        />
                        <FormControlLabel
                            label="Label2"
                            control={
                                <Checkbox
                                    checked={label2Checked}
                                    onChange={(e) => setLabel2Checked(e.target.checked)}
                                />
                            }
                        />
                        <FormControlLabel
                            label="Label3"
                            control={
                                <Checkbox
                                    checked={label3Checked}
                                    onChange={(e) => setLabel3Checked(e.target.checked)}
                                />
                            }
                        />
                        <FormControlLabel
                            label="Label4"
                            control={
                                <Checkbox
                                    checked={label4Checked}
                                    onChange={(e) => setLabel4Checked(e.target.checked)}
                                />
                            }
                        />
                    </FormGroup>
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
                {sent && <Typography sx={useStyles.title}
                                     variant='subtitle1'
                                     color='primary'
                                     gutterBottom
                >
                    {'Form has been created'.toUpperCase()}
                </Typography>}
            </form>
        </Container>
    );
};

export default GenerateForm;
