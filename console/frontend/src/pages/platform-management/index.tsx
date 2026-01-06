import { memo, FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Table, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getRpaSourceList, createRpaSource, updateRpaSource, deleteRpaSource } from '@/services/rpa';
import { RpaInfo } from '@/types/rpa';
import { PlatformModal } from './components/platform-modal';

const PlatformManagement: FC = () => {
  const { t } = useTranslation();
  const modalRef = useRef<{ showModal: (values?: RpaInfo) => void }>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  const { data: platformList = [], loading, refresh } = useRequest(
    () => getRpaSourceList(),
    {
      refreshDeps: [],
    }
  );

  // 过滤数据
  const filteredList = platformList.filter(item => {
    if (!searchValue) return true;
    return item.name?.toLowerCase().includes(searchValue.toLowerCase());
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteRpaSource(id);
      message.success(t('platform.deleteSuccess'));
      refresh();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('platform.deleteFailed'));
    }
  };

  const columns = [
    {
      title: t('platform.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t('platform.name'),
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: t('platform.category'),
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: t('platform.icon'),
      dataIndex: 'icon',
      key: 'icon',
      width: 100,
      render: (icon: string) => {
        if (!icon) return '-';
        return (
          <img src={icon} alt="icon" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        );
      },
    },
    {
      title: t('platform.path'),
      dataIndex: 'path',
      key: 'path',
      width: 250,
      render: (path: string) => {
        if (!path) return '-';
        return (
          <a href={path} target="_blank" rel="noopener noreferrer">
            {path}
          </a>
        );
      },
    },
    {
      title: t('platform.remarks'),
      dataIndex: 'remarks',
      key: 'remarks',
      ellipsis: true,
    },
    {
      title: t('platform.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: t('platform.updateTime'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: t('platform.operation'),
      key: 'operation',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: RpaInfo) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => modalRef.current?.showModal(record)}
          >
            {t('platform.edit')}
          </Button>
          <Popconfirm
            title={t('platform.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('btnOk')}
            cancelText={t('btnCancel')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('platform.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('platform.title')}</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => modalRef.current?.showModal()}
        >
          {t('platform.create')}
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('platform.searchPlaceholder')}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-64"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredList}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => t('platform.total', { total }),
        }}
      />

      <PlatformModal ref={modalRef} onSuccess={refresh} />
    </div>
  );
};

export default memo(PlatformManagement);
