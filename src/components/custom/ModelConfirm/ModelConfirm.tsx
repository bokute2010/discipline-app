import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';

interface ModalConfirmProps {
  title: string;
  open: boolean;
  onClose: () => void;
  message?: string;
  onConfirm: () => void;
  isWarning?: boolean;
}

const ModalConfirm = ({
  open,
  onClose,
  message,
  title,
  onConfirm,
  isWarning = true
}: ModalConfirmProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="max-w-[600px] top-[15%]">
        <ModalHeader className="py-4 px-5">
          <ModalTitle>{title}</ModalTitle>

          <button className="btn btn-sm btn-icon btn-light btn-clear shrink-0" onClick={onClose}>
            <KeenIcon icon="black-left" />
          </button>
        </ModalHeader>
        <ModalBody className="grid gap-5 px-5 py-5">
          <p>{message}</p>
          <div className="flex justify-end px-5 py-4">
            <button
              onClick={() => {
                onConfirm();
              }}
              className={`btn btn-sm  ${isWarning ? 'btn-danger' : 'btn-primary'}`}
            >
              {isWarning ? 'Delete' : 'Confirm'}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { ModalConfirm };
