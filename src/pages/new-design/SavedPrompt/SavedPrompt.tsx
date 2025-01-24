import { Fragment } from 'react';
import { Container } from '@/components/container';
import { ListSavedPrompt } from './ListSavedPrompt';



const SavedPromptPage = () => {
  return (
    <Fragment>
      <Container>
        <ListSavedPrompt />
      </Container>
    </Fragment>
  );
};

export { SavedPromptPage };