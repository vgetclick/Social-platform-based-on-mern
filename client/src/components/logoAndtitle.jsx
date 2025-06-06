import { Box, Typography } from '@mui/material';
import Memories from '../images/Memories.png';
import React from 'react';
const LogoAndTitle = () => {
    
    return (
        <Box
            sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Typography variant="h4" sx={{ marginRight: 1 }}>
                社交分享平台
            </Typography>
            <img src={Memories} alt="logo" height="50" />
        </Box>
    );
};

export default LogoAndTitle;