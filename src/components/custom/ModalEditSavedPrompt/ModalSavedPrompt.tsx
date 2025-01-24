import { Modal, ModalContent, ModalBody, ModalHeader, ModalTitle } from '@/components/modal';
import { KeenIcon } from '@/components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { type MouseEvent, useEffect, useState } from 'react';
import clsx from 'clsx';
import { IPayloadUpdate, ISavedPromptItem } from '@/interfaces/saved-prompt.interface';

interface ModalSavedPromptEditProps {
  title: string;
  open: boolean;
  onClose: () => void;
  message?: string;
  onConfirm: (values: IPayloadUpdate) => void;
  savedPrompt: ISavedPromptItem | null;
}

const loginSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Tối thiểu 3 ký tự')
    .max(255, 'Tối đa 255 ký tự')
    .required('Vui lòng nhập tiêu đề'),
  prompt: Yup.string()
    .min(3, 'Tối thiểu 3 ký tự')
    .max(3000, 'Tối đa 3000 ký tự')
    .required('Vui lòng nhập nội dung quy trình')
});

const ModalSavedPromptEdit = ({
  open,
  onClose,
  title,
  onConfirm,
  savedPrompt
}: ModalSavedPromptEditProps) => {
  const initialValues = {
    title: savedPrompt?.title || '',
    prompt: savedPrompt?.content || ''
  };
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (!savedPrompt) {
        return;
      }
      setLoading(true);

      try {
        onConfirm({
          title: values.title,
          content: values.prompt,
          id: savedPrompt.id
        });
      } catch {
        setStatus('The login details are incorrect');
        setSubmitting(false);
      }

      setLoading(false);
      formik.resetForm();
    }
  });

  useEffect(() => {
    formik.setValues({
      title: savedPrompt?.title || '',
      prompt: savedPrompt?.content || ''
    });
  }, [savedPrompt]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent className="max-w-[600px] top-[15%]">
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

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Quy trình</label>
              <label className="">
                <textarea
                  placeholder="Nhập quy trình"
                  autoComplete="off"
                  {...formik.getFieldProps('prompt')}
                  className={
                    clsx('form-control', {
                      'is-invalid': formik.touched.prompt && formik.errors.prompt
                    }) + ' textarea text-2sm text-gray-600 font-normal'
                  }
                  rows={5}
                />
              </label>
              {formik.touched.prompt && formik.errors.prompt && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.prompt}
                </span>
              )}
            </div>

            <div className="flex justify-end py-4">
              <button
                type="submit"
                disabled={loading || formik.isSubmitting}
                className={`btn btn-sm btn-primary`}
              >
                Cập nhật
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

export { ModalSavedPromptEdit };
