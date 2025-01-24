import { Fragment } from 'react';
import { Container } from '@/components/container';
import { ListAiModels } from './AiModels/ListAIModels';
import { AIBoxChat } from './AiModels/AIBoxChat';
import { ListChatRoom } from './ChatRoom';

const AIModelsPage = () => {
  return (
    <Fragment>
      <Container className='h-full'>
          <div className="grid gap-5 lg:gap-7.5 h-full">
            <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
              <div className="lg:col-span-1">
                <div className="flex flex-col gap-5 h-full">
                  <ListAiModels />
                  <ListChatRoom />
                </div>
              </div>
              <div className="lg:col-span-2">
                <AIBoxChat />
              </div>
            </div>
          </div>
      </Container>
    </Fragment>
  );
};

export { AIModelsPage };
