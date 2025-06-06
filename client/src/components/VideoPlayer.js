import React from 'react';
import ReactPlayer from 'react-player';
import { Box, Typography, Paper } from '@mui/material';

const VideoPlayer = ({ url, title, onEnded }) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onEnded={onEnded}
        />
      </Box>
    </Paper>
  );
};

export default VideoPlayer; 