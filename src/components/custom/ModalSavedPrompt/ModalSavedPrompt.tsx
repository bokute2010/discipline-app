import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { type MouseEvent, useState } from 'react';
import clsx from 'clsx';

interface ModalSavedPromptProps {
  title: string;
  open: boolean;
  onClose: () => void;
  message?: string;
  onConfirm: (values: { title: string }) => void;
  isWarning?: boolean;
}

const loginSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Tối thiểu 3 ký tự')
    .max(255, 'Tối đa 255 ký tự')
    .required('Vui lòng nhập tiêu đề')
});
const initialValues = {
  title: ''
};

const ModalSavedPrompt = ({
  open,
  onClose,
  title,
  onConfirm,
  isWarning = true
}: ModalSavedPromptProps) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        console.log('values', values);
        onConfirm(values);
      } catch {
        setStatus('The login details are incorrect');
        setSubmitting(false);
      }

      setLoading(false);
      formik.resetForm();
    }
  });

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="max-w-[400px] top-[15%]">
        <ModalHeader className="py-4 px-5">
          <ModalTitle>{title}</ModalTitle>

          <button className="btn btn-sm btn-icon btn-light btn-clear shrink-0" onClick={onClose}>
            <KeenIcon icon="black-left" />
          </button>
        </ModalHeader>
        <ModalBody className="grid  px-5">
          <form className="card-body flex flex-col gap-5" onSubmit={formik.handleSubmit} noValidate>
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Tiêu đề</label>
              <label className="input">
                <input
                  placeholder="Nhập tiêu đề"
                  autoComplete="off"
                  {...formik.getFieldProps('title')}
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.title && formik.errors.title
                  })}
                />
              </label>
              {formik.touched.title && formik.errors.title && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.title}
                </span>
              )}
            </div>

            <div className="flex justify-end py-4">
              <button
                type="submit"
                disabled={loading || formik.isSubmitting}
                className={`btn btn-sm  ${isWarning ? 'btn-danger' : 'btn-primary'}`}
              >
                {isWarning ? 'Delete' : 'Confirm'}
              </button>
            </div>

            {formik.status && (
              <div className="text-danger text-xs mt-1" role="alert">
                {formik.status}
              </div>
            )}
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export { ModalSavedPrompt };
