import React from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress } from "@mui/material";
import Post from "./Post/Post.js";

const Posts = ({ setCurrentId }) => {
  const posts = useSelector((state) => state.posts);
  console.log(posts);

  return (
    !posts.length ? (<CircularProgress />) : (
      <Grid
        container
        alignItems="stretch"
        spacing={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 2,
        }}
      >
        {posts.map((post) => (
          <Grid key={post._id} item xs={12} sm={6} md={4}>
            <Post post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Posts;
