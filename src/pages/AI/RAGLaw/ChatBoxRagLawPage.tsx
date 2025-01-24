import { Fragment } from 'react';
import { Container } from '@/components/container';
import { ChatBoxRagLawContent } from './ChatBoxRagLawContent';
const ChatBoxRagLawPage = () => {
  return (
    <Fragment>
      <Container>
        <ChatBoxRagLawContent />
      </Container>
    </Fragment>
  );
};

export { ChatBoxRagLawPage };
