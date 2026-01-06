import { forwardRef, useImperativeHandle, useState } from 'react';
import { Form, Input, Button, Modal, message, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { createRpaSource, updateRpaSource } from '@/services/rpa';
import { RpaInfo } from '@/types/rpa';
import useAntModal from '@/hooks/use-ant-modal';

interface PlatformModalProps {
  onSuccess?: () => void;
}

export const PlatformModal = forwardRef<
  { showModal: (values?: RpaInfo) => void },
  PlatformModalProps
>(({ onSuccess }, ref) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [type, setType] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(false);
  const { showModal, commonAntModalProps, open, closeModal } = useAntModal();

  useImperativeHandle(ref, () => ({
    showModal: (values?: RpaInfo) => {
      if (values) {
        setType('edit');
        form.setFieldsValue({
          ...values,
          // value字段是JSON字符串，需要格式化显示
          value: values.value ? JSON.stringify(JSON.parse(values.value), null, 2) : '',
        });
      } else {
        setType('create');
        form.resetFields();
      }
      showModal();
    },
  }));

  const handleReset = () => {
    closeModal();
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 验证value字段是否为有效的JSON
      let parsedValue = values.value;
      if (values.value) {
        try {
          parsedValue = JSON.stringify(JSON.parse(values.value));
        } catch (e) {
          message.error(t('platform.invalidJson'));
          return;
        }
      }

      const params = {
        ...values,
        value: parsedValue,
      };

      if (type === 'create') {
        await createRpaSource(params);
        message.success(t('platform.createSuccess'));
      } else {
        await updateRpaSource(values.id, params);
        message.success(t('platform.updateSuccess'));
      }

      onSuccess?.();
      handleReset();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('platform.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" wrapperCol={{ span: 24 }}>
      <Modal
        {...commonAntModalProps}
        title={type === 'create' ? t('platform.create') : t('platform.edit')}
        onCancel={handleReset}
        footer={
          <Space>
            <Button onClick={handleReset} disabled={loading}>
              {t('btnCancel')}
            </Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              {t('btnOk')}
            </Button>
          </Space>
        }
        width={800}
      >
        <div className="pt-4">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label={t('platform.name')}
            rules={[{ required: true, message: t('platform.nameRequired') }]}
          >
            <Input placeholder={t('platform.namePlaceholder')} />
          </Form.Item>

          <Form.Item name="category" label={t('platform.category')}>
            <Input placeholder={t('platform.categoryPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="value"
            label={t('platform.value')}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error(t('platform.invalidJson')));
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={8}
              placeholder={t('platform.valuePlaceholder')}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item name="icon" label={t('platform.icon')}>
            <Input placeholder={t('platform.iconPlaceholder')} />
          </Form.Item>

          <Form.Item name="path" label={t('platform.path')}>
            <Input placeholder={t('platform.pathPlaceholder')} />
          </Form.Item>

          <Form.Item name="remarks" label={t('platform.remarks')}>
            <Input.TextArea rows={3} placeholder={t('platform.remarksPlaceholder')} />
          </Form.Item>
        </div>
      </Modal>
    </Form>
  );
});
