import React from 'react';
import GenerateForm from './GenerateForm'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Form from "./Form";
import ViewData from "./ViewData";


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Akshar',
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
    },
});

const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Router>
                <Routes>
                    <Route path='/' element={<Form/>}/>
                    <Route path='/create' element={<GenerateForm/>}/>
                    <Route path='/view' element={<ViewData/>}/>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;