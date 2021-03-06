import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home(){
    const { loading, data : {getPosts: posts} } = useQuery(FETCH_POSTS_QUERY); // destructure loading and data. from data destructure getPosts and alias as posts. 
    
    //iterate through posts and display each
    
    return (
        <Grid columns={3}>
          <Grid.Row className="page-title">
            <h1>Recent Posts</h1>
          </Grid.Row>
          <Grid.Row>
            {loading ? (
              <h1>Loading posts..</h1>
            ) : (
              <Transition.Group>
                {posts &&
                  posts.map((post) => (
                    <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                      <PostCard post={post} />
                    </Grid.Column>
                  ))}
              </Transition.Group>
            )}
          </Grid.Row>
        </Grid>
      );


}

export default Home;