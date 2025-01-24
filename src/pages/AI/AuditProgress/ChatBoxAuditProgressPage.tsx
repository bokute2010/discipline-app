import { Fragment } from 'react';
import { Container } from '@/components/container';
import { ChatBoxAuditProgressContent } from './ChatBoxAuditProgressContent';

const ChatBoxAuditProgressPage = () => {
  return (
    <Fragment>
      <Container>
        <ChatBoxAuditProgressContent />
      </Container>
    </Fragment>
  );
};

export { ChatBoxAuditProgressPage };
