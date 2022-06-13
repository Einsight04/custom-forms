import React, {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const ViewData = () => {
    interface formsDataType {
        firstName: string,
        lastName: string,
        email: string,
        label1: string,
        label2: string,
        label3: string,
        label4: string
    }

    const [jsonView, setJsonView]: any = React.useState([]);

    useEffect(() => {
        fetch('http://localhost:3600/api/view-data')
            .then(response => response.json())
            .then(data => setJsonView(data))
    }, [])

    return (
        <Container>
            <Grid
                container
                  spacing={0}
                  justifyContent="center"
            >
                {jsonView.map((value: formsDataType) => (
                    <Grid item xs={12} md={6} lg={4}>
                        <Paper sx={{margin: '2rem 1rem 0 1rem'}}>
                            <Typography align='center' sx={{padding: 1}}>
                                {`FIRST NAME: ${value.firstName}`}
                            </Typography>
                            <Typography align='center' sx={{padding: 1}}>
                                {`LAST NAME: ${value.lastName}`}
                            </Typography>
                            <Typography align='center' sx={{padding: 1}}>
                                {`EMAIL: ${value.email}`}
                            </Typography>
                            <Typography align='center' sx={{padding: 1}}>
                                {`LABEL 1: ${value.label1}`}
                            </Typography>
                            <Typography align='center' sx={{padding: 1}}>
                                {`LABEL 2: ${value.label2}`}
                            </Typography>
                            <Typography align='center' sx={{padding: 1}}>
                                {`LABEL 3: ${value.label3}`}
                            </Typography>
                            <Typography align='center' sx={{padding: 1}}>
                                {`LABEL 4: ${value.label4}`}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ViewData;
